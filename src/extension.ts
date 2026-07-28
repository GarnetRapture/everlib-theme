import * as vscode from 'vscode';
import { NekoiSidebarProvider } from './sidebarProvider';

export function activate(context: vscode.ExtensionContext): void {
  const sidebarProvider = new NekoiSidebarProvider(context.extensionUri);

  // Auto-apply wallpaper background to main editor area on activation
  setTimeout(() => {
    vscode.commands.executeCommand('nekoiEversoul.setupWallpaper');
  }, 1000);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      NekoiSidebarProvider.viewType,
      sidebarProvider
    )
  );

  const openSidebarDisposable = vscode.commands.registerCommand(
    'nekoiEversoul.openSidebar',
    () => {
      vscode.commands.executeCommand('workbench.view.extension.nekoi-eversoul-sidebar-container');
    }
  );

  const setupWallpaperDisposable = vscode.commands.registerCommand(
    'nekoiEversoul.setupWallpaper',
    async () => {
      const wallpaperPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'wallpaper', 'garnet-rapture-costume01.png').fsPath;
      const formattedPath = wallpaperPath.replace(/\\/g, '/');
      const fileUri = `file:///${formattedPath.startsWith('/') ? formattedPath.slice(1) : formattedPath}`;

      // 1. shalldie/vscode-background latest 2026 specification
      const config = vscode.workspace.getConfiguration('background');
      await config.update('enabled', true, vscode.ConfigurationTarget.Global);
      await config.update('useDefault', false, vscode.ConfigurationTarget.Global);
      await config.update('customImages', [fileUri], vscode.ConfigurationTarget.Global);
      await config.update('editor', {
        useFront: false,
        style: {
          'background-position': 'center',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'opacity': 0.25
        },
        images: [fileUri]
      }, vscode.ConfigurationTarget.Global);

      // 2. background-cover extension compatibility specification
      const coverConfig = vscode.workspace.getConfiguration('backgroundCover');
      await coverConfig.update('imagePath', formattedPath, vscode.ConfigurationTarget.Global);
      await coverConfig.update('opacity', 0.25, vscode.ConfigurationTarget.Global);

      vscode.window.showInformationMessage(`everlib Default Wallpaper configured: ${fileUri}`);
    }
  );

  const selectCustomWallpaperDisposable = vscode.commands.registerCommand(
    'nekoiEversoul.selectCustomWallpaper',
    async () => {
      const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Select Editor Background Image',
        filters: {
          'Images': ['png', 'jpg', 'jpeg', 'webp', 'gif']
        }
      };

      const fileUri = await vscode.window.showOpenDialog(options);
      if (fileUri && fileUri[0]) {
        const imagePath = fileUri[0].fsPath.replace(/\\/g, '/');
        const formattedUri = `file:///${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`;

        // 1. shalldie/vscode-background latest 2026 specification
        const config = vscode.workspace.getConfiguration('background');
        await config.update('enabled', true, vscode.ConfigurationTarget.Global);
        await config.update('useDefault', false, vscode.ConfigurationTarget.Global);
        await config.update('customImages', [formattedUri], vscode.ConfigurationTarget.Global);
        await config.update('editor', {
          useFront: false,
          style: {
            'background-position': 'center',
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'opacity': 0.25
          },
          images: [formattedUri]
        }, vscode.ConfigurationTarget.Global);

        // 2. background-cover extension compatibility specification
        const coverConfig = vscode.workspace.getConfiguration('backgroundCover');
        await coverConfig.update('imagePath', imagePath, vscode.ConfigurationTarget.Global);
        await coverConfig.update('opacity', 0.25, vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage(`everlib Custom Wallpaper set: ${formattedUri}`);
      }
    }
  );

  context.subscriptions.push(openSidebarDisposable, setupWallpaperDisposable, selectCustomWallpaperDisposable);
}

export function deactivate(): void {}
