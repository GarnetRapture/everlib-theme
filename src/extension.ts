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

  const createChatSessionTabDisposable = vscode.commands.registerCommand(
    'nekoiEversoul.createChatSessionTab',
    () => {
      const panel = vscode.window.createWebviewPanel(
        'nekoiChatSession',
        'Claude Code / Codex Chat Session',
        vscode.ViewColumn.Active,
        {
          enableScripts: true,
          localResourceRoots: [context.extensionUri]
        }
      );

      const wallpaperUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'resources', 'wallpaper', 'garnet-rapture-costume01.png'));
      const stickerUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'resources', 'sticker', 'garnet-rapture-bunny.png'));
      const iconUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'resources', 'icon', 'garnet-rapture-cards.png'));

      panel.webview.html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: rgba(13, 8, 10, 0.85);
      color: #f4e6db;
      font-family: system-ui, sans-serif;
      position: relative;
      overflow: hidden;
      height: 100vh;
      box-sizing: border-box;
    }
    .bg-wall {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: url('${wallpaperUri}') center/cover no-repeat;
      opacity: 0.3;
      pointer-events: none;
    }
    .header {
      display: flex; align-items: center; gap: 12px;
      padding-bottom: 12px; border-bottom: 1px solid #4a0d18;
      position: relative; z-index: 2;
    }
    .header img { width: 32px; height: 32px; }
    .header h1 { margin: 0; font-size: 18px; color: #e6b800; }
    .content {
      position: relative; z-index: 2; margin-top: 20px;
      background: rgba(20, 5, 9, 0.75); border: 1px solid #4a0d18;
      padding: 16px; border-radius: 8px; backdrop-filter: blur(10px);
    }
    .sticker {
      position: absolute; bottom: 20px; right: 20px; width: 140px; opacity: 0.6; z-index: 1;
    }
  </style>
</head>
<body>
  <div class="bg-wall"></div>
  <img src="${stickerUri}" class="sticker" />
  <div class="header">
    <img src="${iconUri}" />
    <h1>Claude Code / Codex Chat Session Tab</h1>
  </div>
  <div class="content">
    <p>everlib 에디터 탭 채팅 세션입니다. 가넷 딥 다크 아크릴 스타일이 메인 에디터 영역 탭에 100% 렌더링됩니다.</p>
  </div>
</body>
</html>`;
    }
  );

  context.subscriptions.push(openSidebarDisposable, setupWallpaperDisposable, createChatSessionTabDisposable);
}

export function deactivate(): void {}
