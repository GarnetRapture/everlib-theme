import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { NekoiSidebarProvider } from './sidebarProvider';

async function elevatePatchWorkbenchHTML(htmlPath: string, fileUri: string): Promise<boolean> {
  return new Promise((resolve) => {
    const tempScriptDir = process.env.TEMP || process.env.TMP || 'C:\\Windows\\Temp';
    const tempPsPath = path.join(tempScriptDir, 'everlib_admin_patch.ps1');

    const psScript = `
$htmlPath = "${htmlPath.replace(/\\/g, '\\\\')}";
$fileUri = "${fileUri}";
$markerStart = '<!-- [everlib-wallpaper-start] -->';
$markerEnd = '<!-- [everlib-wallpaper-end] -->';
$content = Get-Content -Path $htmlPath -Raw -Encoding UTF8;
if ($content.Contains($markerStart)) {
    $content = $content -replace "(?s)$([regex]::Escape($markerStart)).*?$([regex]::Escape($markerEnd))", "";
}
$style = "$markerStart\`n<style>\`n  body.monaco-workbench, .monaco-workbench { background-image: url('$fileUri') !important; background-size: cover !important; background-position: right center !important; background-repeat: no-repeat !important; }\`n  .monaco-workbench .part.editor > .content, .monaco-workbench .part.editor, .monaco-workbench .part.sidebar, .monaco-workbench .part.panel { background-color: rgba(11, 18, 22, 0.45) !important; }\`n  .monaco-workbench .part.panel, .monaco-workbench .part.sidebar, .monaco-workbench .part.editor, .monaco-workbench iframe, .monaco-workbench .webview, .monaco-workbench .interactive-session, .monaco-workbench .chat-container { background: transparent !important; background-color: transparent !important; }\`n</style>\`n$markerEnd";
if ($content.Contains("</head>")) {
    $content = $content.Replace("</head>", "$style\`n</head>");
} else {
    $content += $style;
}
Set-Content -Path $htmlPath -Value $content -Encoding UTF8;
`;

    try {
      fs.writeFileSync(tempPsPath, psScript, 'utf8');
      const cmd = `powershell -Command "Start-Process powershell -Verb RunAs -Wait -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \\"${tempPsPath}\\"'"`;
      exec(cmd, (err) => {
        try { fs.unlinkSync(tempPsPath); } catch {}
        resolve(!err);
      });
    } catch {
      resolve(false);
    }
  });
}

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

function findVSCodeWorkbenchHTMLPaths(): string[] {
  const paths: string[] = [
    path.join(vscode.env.appRoot, 'out', 'vs', 'workbench', 'workbench.html'),
    path.join(vscode.env.appRoot, 'out', 'vs', 'code', 'electron-sandbox', 'workbench', 'workbench.html'),
    path.join(vscode.env.appRoot, 'out', 'vs', 'code', 'electron-browser', 'workbench', 'workbench.html')
  ];

  const execDir = path.dirname(process.execPath);
  paths.push(
    path.join(execDir, 'resources', 'app', 'out', 'vs', 'code', 'electron-browser', 'workbench', 'workbench.html'),
    path.join(execDir, 'resources', 'app', 'out', 'vs', 'code', 'electron-sandbox', 'workbench', 'workbench.html'),
    path.join(execDir, 'resources', 'app', 'out', 'vs', 'workbench', 'workbench.html')
  );

  try {
    const subDirs = fs.readdirSync(execDir);
    for (const sub of subDirs) {
      const fullSub = path.join(execDir, sub);
      try {
        if (fs.statSync(fullSub).isDirectory()) {
          paths.push(
            path.join(fullSub, 'resources', 'app', 'out', 'vs', 'code', 'electron-browser', 'workbench', 'workbench.html'),
            path.join(fullSub, 'resources', 'app', 'out', 'vs', 'code', 'electron-sandbox', 'workbench', 'workbench.html'),
            path.join(fullSub, 'resources', 'app', 'out', 'vs', 'workbench', 'workbench.html')
          );
        }
      } catch {}
    }
  } catch {}

  return paths.filter(p => fs.existsSync(p));
}

async function injectWorkbenchHTMLWallpaper(imageFsPath: string): Promise<boolean> {
  const normalizedPath = imageFsPath.replace(/\\/g, '/');
  const fileUri = `file:///${normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath}`;
  
  const possiblePaths = findVSCodeWorkbenchHTMLPaths();

  let patched = false;
  for (const htmlPath of possiblePaths) {
    if (fs.existsSync(htmlPath)) {
      try {
        let content = fs.readFileSync(htmlPath, 'utf8');
        const markerStart = '<!-- [everlib-wallpaper-start] -->';
        const markerEnd = '<!-- [everlib-wallpaper-end] -->';

        if (content.includes(markerStart)) {
          const regex = new RegExp(`${markerStart.replace(/\[/g, '\\[').replace(/\]/g, '\\]')}[\\s\\S]*?${markerEnd.replace(/\[/g, '\\[').replace(/\]/g, '\\]')}`, 'g');
          content = content.replace(regex, '');
        }

        const injectHTML = `
${markerStart}
<style>
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
  .monaco-workbench .part.panel,
  .monaco-workbench .part.sidebar,
  .monaco-workbench .part.editor,
  .monaco-workbench iframe,
  .monaco-workbench .webview,
  .monaco-workbench .interactive-session,
  .monaco-workbench .chat-container {
    background: transparent !important;
    background-color: transparent !important;
  }
</style>
${markerEnd}
`;
        if (content.includes('</head>')) {
          content = content.replace('</head>', `${injectHTML}\n</head>`);
        } else {
          content += injectHTML;
        }

        fs.writeFileSync(htmlPath, content, 'utf8');
        patched = true;
      } catch (err: any) {
        if (err.code === 'EPERM' || err.code === 'EACCES') {
          const elevatedSuccess = await elevatePatchWorkbenchHTML(htmlPath, fileUri);
          if (elevatedSuccess) {
            patched = true;
          }
        }
      }
    }
  }

  return patched;
}

async function triggerBackgroundReload(customImagePath?: string): Promise<void> {
  try {
    await injectTransparentWebviewCSS();
  } catch {}
  if (customImagePath) {
    try {
      const patchedHTML = await injectWorkbenchHTMLWallpaper(customImagePath);
      if (patchedHTML) {
        const action = await vscode.window.showInformationMessage('EVERLIB: Workbench HTML background patched successfully. Reload Window to apply changes.', 'Reload Window');
        if (action === 'Reload Window') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      }
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
