import * as vscode from 'vscode';
import { NekoiSidebarProvider } from './sidebarProvider';

export function activate(context: vscode.ExtensionContext): void {
  const sidebarProvider = new NekoiSidebarProvider(context.extensionUri);

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

  context.subscriptions.push(openSidebarDisposable);
}

export function deactivate(): void {}
