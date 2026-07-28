import * as vscode from 'vscode';

export class NekoiSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'nekoiEversoulSidebar';
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'sendMessage': {
          if (data.value) {
            vscode.window.showInformationMessage(`Nekoi Claude AI: Received "${data.value}"`);
            this._replyMessage(`Ack: Processed "${data.value}"`);
          }
          break;
        }
        case 'applyTheme': {
          await vscode.workspace.getConfiguration('workbench').update('colorTheme', 'Nekoi Eversoul: Garnet Rapture', true);
          vscode.window.showInformationMessage('Nekoi Eversoul: Garnet Rapture theme applied.');
          break;
        }
        case 'setupWallpaper': {
          await vscode.commands.executeCommand('nekoiEversoul.setupWallpaper');
          break;
        }
      }
    });
  }

  private _replyMessage(text: string): void {
    if (this._view) {
      this._view.webview.postMessage({ type: 'addResponse', value: text });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const nonce = getNonce();

    const wallpaperUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'wallpaper', 'garnet-rapture-costume01.png'));
    const stickerUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'sticker', 'garnet-rapture-bunny.png'));
    const iconUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'icon', 'garnet-rapture-cards.png'));

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>Nekoi Claude AI Panel</title>
  <style>
    :root {
      --bg-acrylic: rgba(13, 8, 10, 0.45);
      --card-acrylic: rgba(43, 8, 16, 0.55);
      --text-main: #f4e6db;
      --text-sub: #e6b800;
      --accent-color: #ff2a4b;
      --border-acrylic: rgba(255, 42, 75, 0.3);
      --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6);
    }
    body {
      font-family: var(--vscode-font-family, system-ui, -apple-system, sans-serif);
      background: var(--bg-acrylic);
      color: var(--vscode-sideBar-foreground, var(--text-main));
      margin: 0;
      padding: 12px;
      display: flex;
      flex-direction: column;
      height: 100vh;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(14px) saturate(180%);
      -webkit-backdrop-filter: blur(14px) saturate(180%);
    }
    .bg-wallpaper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${wallpaperUri}');
      background-size: cover;
      background-position: center;
      opacity: 0.35;
      pointer-events: none;
      z-index: 0;
    }
    .bg-sticker {
      position: absolute;
      bottom: 65px;
      right: -5px;
      width: 120px;
      opacity: 0.55;
      pointer-events: none;
      z-index: 1;
      filter: drop-shadow(0 0 12px rgba(255, 42, 75, 0.5));
    }
    .container {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: rgba(20, 5, 9, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-acrylic);
      border-radius: 10px;
      margin-bottom: 12px;
      box-shadow: var(--glass-shadow);
    }
    .header img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    .header h2 {
      margin: 0;
      font-size: 13px;
      font-weight: 700;
      color: var(--text-sub);
      flex: 1;
    }
    .badge {
      background: linear-gradient(135deg, #ff4d6a, #8f1a2e);
      color: #ffffff;
      font-size: 9px;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: bold;
      letter-spacing: 0.5px;
      box-shadow: 0 0 8px rgba(255, 77, 106, 0.5);
    }
    .panel-card {
      background: rgba(20, 5, 9, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-acrylic);
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 12px;
      box-shadow: var(--glass-shadow);
    }
    .panel-card h3 {
      margin: 0 0 8px 0;
      font-size: 12px;
      color: var(--text-sub);
      font-weight: 600;
    }
    .panel-card p {
      margin: 0 0 10px 0;
      font-size: 11px;
      line-height: 1.4;
      color: var(--text-main);
    }
    .action-btn {
      width: 100%;
      background: linear-gradient(135deg, #4a0d18, #2b0810);
      color: #ffffff;
      border: 1px solid var(--border-acrylic);
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .action-btn:hover {
      background: linear-gradient(135deg, #ff2a4b, #8b152b);
      box-shadow: 0 0 12px rgba(255, 42, 75, 0.6);
    }
  </style>
</head>
<body>
  <div class="bg-wallpaper"></div>
  <img src="${stickerUri}" class="bg-sticker" alt="Sticker" />

  <div class="container">
    <div class="header">
      <img src="${iconUri}" alt="Icon" />
      <h2>everlib Controller</h2>
      <span class="badge">v1.0.6</span>
    </div>

    <div class="panel-card">
      <h3>Garnet Rapture Theme</h3>
      <p>Applies Garnet Rapture deep dark crimson red color palette.</p>
      <button class="action-btn" id="applyThemeBtn">Apply Garnet Rapture Theme</button>
    </div>

    <div class="panel-card">
      <h3>Editor Wallpaper Setup</h3>
      <p>Injects background wallpaper into the main editor area.</p>
      <button class="action-btn" id="setupWallpaperBtn">Setup Editor Wallpaper</button>
    </div>

    <div class="panel-card">
      <h3>Claude / Codex AI Integration</h3>
      <p>Official chat.*, inlineChat.*, and interactive.* tokens are fully active.</p>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const applyThemeBtn = document.getElementById('applyThemeBtn');
    const setupWallpaperBtn = document.getElementById('setupWallpaperBtn');

    applyThemeBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'applyTheme' });
    });

    setupWallpaperBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'setupWallpaper' });
    });
  </script>
</body>
</html>`;
  }
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
