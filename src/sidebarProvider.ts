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
    .chat-container {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-right: 4px;
    }
    .message {
      padding: 12px 14px;
      border-radius: 12px;
      font-size: 12px;
      line-height: 1.5;
      max-width: 88%;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
    .message.system {
      background: rgba(44, 22, 32, 0.55);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-acrylic);
      align-self: flex-start;
      color: var(--text-main);
    }
    .message.user {
      background: linear-gradient(135deg, rgba(255, 77, 106, 0.85), rgba(110, 32, 54, 0.85));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      align-self: flex-end;
    }
    .action-bar {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .input-box {
      display: flex;
      gap: 6px;
    }
    input[type="text"] {
      flex: 1;
      background: rgba(24, 13, 18, 0.7);
      backdrop-filter: blur(10px);
      color: var(--text-main);
      border: 1px solid var(--border-acrylic);
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 12px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input[type="text"]:focus {
      border-color: var(--accent-color);
      box-shadow: 0 0 10px rgba(255, 77, 106, 0.3);
    }
    button {
      background: linear-gradient(135deg, #6e2036, #4a1520);
      color: #ffffff;
      border: 1px solid var(--border-acrylic);
      padding: 9px 14px;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    button:hover {
      background: linear-gradient(135deg, #ff4d6a, #8f1a2e);
      box-shadow: 0 0 12px rgba(255, 77, 106, 0.6);
    }
    .theme-btn {
      width: 100%;
      background: rgba(44, 22, 32, 0.4);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-acrylic);
      color: var(--text-sub);
    }
    .theme-btn:hover {
      background: rgba(110, 32, 54, 0.6);
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="bg-wallpaper"></div>
  <img src="${stickerUri}" class="bg-sticker" alt="Sticker" />

  <div class="container">
    <div class="header">
      <img src="${iconUri}" alt="Icon" />
      <h2>everlib-테마 패널</h2>
      <span class="badge">ACRYLIC</span>
    </div>

    <div class="chat-container" id="chatContainer">
      <div class="message system">
        안녕하세요! everlib 다크 아크릴 투명 패널입니다. 에디터 투명도 및 Garnet Rapture 테마가 결합되어 있습니다.
      </div>
    </div>

    <div class="action-bar">
      <button class="theme-btn" id="applyThemeBtn">Garnet Rapture 테마 즉시 적용</button>
      <div class="input-box">
        <input type="text" id="userInput" placeholder="메시지를 입력하세요..." />
        <button id="sendBtn">전송</button>
      </div>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const applyThemeBtn = document.getElementById('applyThemeBtn');

    function appendMessage(text, isUser) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'message ' + (isUser ? 'user' : 'system');
      msgDiv.textContent = text;
      chatContainer.appendChild(msgDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    sendBtn.addEventListener('click', () => {
      const val = userInput.value.trim();
      if (val) {
        appendMessage(val, true);
        vscode.postMessage({ type: 'sendMessage', value: val });
        userInput.value = '';
      }
    });

    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });

    applyThemeBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'applyTheme' });
    });

    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.type === 'addResponse') {
        appendMessage(message.value, false);
      }
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
