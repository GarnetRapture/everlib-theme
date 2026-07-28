import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { NekoiSidebarProvider } from './sidebarProvider';

async function injectTransparentWebviewCSS(): Promise<void> {
  try {
    const cssPath = path.join(vscode.env.appRoot, 'out', 'vs', 'workbench', 'workbench.desktop.main.css');

    if (fs.existsSync(cssPath)) {
      const existingCSS = fs.readFileSync(cssPath, 'utf8');
      const injectionMarker = '/* everlib Theme Transparent Webview & Panel Injection */';
      
      if (!existingCSS.includes(injectionMarker)) {
        const transparentCSS = `
${injectionMarker}
.monaco-workbench .part.panel,
.monaco-workbench .part.sidebar,
.monaco-workbench .part.editor,
.monaco-workbench iframe,
.monaco-workbench .webview,
.monaco-workbench .interactive-session,
.monaco-workbench .chat-container,
.monaco-workbench .conversation-container {
  background: transparent !important;
  background-color: transparent !important;
}
`;
        fs.appendFileSync(cssPath, transparentCSS, 'utf8');
      }
    }
  } catch (err) {
    // Permission or path error fallback
  }
}

async function injectDirectWallpaperCSS(imageFsPath: string): Promise<void> {
  try {
    const cssPath = path.join(vscode.env.appRoot, 'out', 'vs', 'workbench', 'workbench.desktop.main.css');
    if (fs.existsSync(cssPath)) {
      const normalizedPath = imageFsPath.replace(/\\/g, '/');
      const fileUri = `file:///${normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath}`;
      let content = fs.readFileSync(cssPath, 'utf8');

      const markerStart = '/* [everlib-wallpaper-start] */';
      const markerEnd = '/* [everlib-wallpaper-end] */';
      if (content.includes(markerStart)) {
        const regex = new RegExp(`${markerStart.replace(/\[/g, '\\[').replace(/\]/g, '\\]')}[\\s\\S]*?${markerEnd.replace(/\[/g, '\\[').replace(/\]/g, '\\]')}`, 'g');
        content = content.replace(regex, '');
      }

      const wallpaperCSS = `
${markerStart}
body.monaco-workbench,
.monaco-workbench {
  background-image: url('${fileUri}') !important;
  background-size: cover !important;
  background-position: right center !important;
  background-repeat: no-repeat !important;
}
.monaco-workbench .part.editor > .content,
.monaco-workbench .part.editor,
.monaco-workbench .part.sidebar,
.monaco-workbench .part.panel {
  background-color: rgba(11, 18, 22, 0.45) !important;
}
${markerEnd}
`;
      fs.writeFileSync(cssPath, content + wallpaperCSS, 'utf8');
    }
  } catch (err) {
    // Write fallback
  }
}

async function triggerBackgroundReload(customImagePath?: string): Promise<void> {
  try {
    await injectTransparentWebviewCSS();
  } catch {}
  if (customImagePath) {
    try {
      await injectDirectWallpaperCSS(customImagePath);
    } catch {}
  }
  try {
    await vscode.commands.executeCommand('extension.background.reload');
  } catch {}
  try {
    await vscode.commands.executeCommand('backgroundCover.start');
  } catch {}
}

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
      const fileUriLower = `file:///${formattedPath.charAt(0).toLowerCase()}${formattedPath.slice(1)}`;

      // 1. Write multi-schema paths for maximum extension compatibility
      const config = vscode.workspace.getConfiguration('background');
      await config.update('enabled', true, vscode.ConfigurationTarget.Global);
      await config.update('useDefault', false, vscode.ConfigurationTarget.Global);
      await config.update('customImages', [fileUri, fileUriLower, formattedPath], vscode.ConfigurationTarget.Global);
      await config.update('editor', {
        useFront: false,
        style: {
          'background-position': 'center',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'opacity': 0.25
        },
        images: [fileUri, fileUriLower, formattedPath]
      }, vscode.ConfigurationTarget.Global);

      // 2. background-cover extension compatibility specification
      const coverConfig = vscode.workspace.getConfiguration('backgroundCover');
      await coverConfig.update('imagePath', formattedPath, vscode.ConfigurationTarget.Global);
      await coverConfig.update('opacity', 0.25, vscode.ConfigurationTarget.Global);

      // 3. Automatically trigger background extensions and direct CSS patch
      await triggerBackgroundReload(wallpaperPath);

      vscode.window.showInformationMessage(`everlib Default Wallpaper configured & background reloaded: ${fileUri}`);
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
        const formattedUriLower = `file:///${imagePath.charAt(0).toLowerCase()}${imagePath.slice(1)}`;

        // 1. Write multi-schema paths for maximum extension compatibility
        const config = vscode.workspace.getConfiguration('background');
        await config.update('enabled', true, vscode.ConfigurationTarget.Global);
        await config.update('useDefault', false, vscode.ConfigurationTarget.Global);
        await config.update('customImages', [formattedUri, formattedUriLower, imagePath], vscode.ConfigurationTarget.Global);
        await config.update('editor', {
          useFront: false,
          style: {
            'background-position': 'center',
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'opacity': 0.25
          },
          images: [formattedUri, formattedUriLower, imagePath]
        }, vscode.ConfigurationTarget.Global);

        // 2. background-cover extension compatibility specification
        const coverConfig = vscode.workspace.getConfiguration('backgroundCover');
        await coverConfig.update('imagePath', imagePath, vscode.ConfigurationTarget.Global);
        await coverConfig.update('opacity', 0.25, vscode.ConfigurationTarget.Global);

        // 3. Automatically trigger background extensions and direct CSS patch
        await triggerBackgroundReload(imagePath);

        vscode.window.showInformationMessage(`everlib Custom Wallpaper set & background reloaded: ${formattedUri}`);
      }
    }
  );

  context.subscriptions.push(openSidebarDisposable, setupWallpaperDisposable, selectCustomWallpaperDisposable);
}

export function deactivate(): void {}
