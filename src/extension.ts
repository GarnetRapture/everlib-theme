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
      const fileUri = `file:///${wallpaperPath.replace(/\\/g, '/')}`;

      const config = vscode.workspace.getConfiguration('background');
      await config.update('enabled', true, vscode.ConfigurationTarget.Global);
      await config.update('useDefault', false, vscode.ConfigurationTarget.Global);
      await config.update('customImages', [fileUri], vscode.ConfigurationTarget.Global);

      vscode.window.showInformationMessage(`everlib Wallpaper configured: ${fileUri}`);
    }
  );

  context.subscriptions.push(openSidebarDisposable, setupWallpaperDisposable);
}

export function deactivate(): void {}
