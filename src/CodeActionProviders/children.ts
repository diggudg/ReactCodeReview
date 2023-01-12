import * as vscode from 'vscode';
export class InternalOverlayCodeActionsProvider implements vscode.CodeActionProvider {
    // Provide a code action for the "content" prop
    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.CodeAction[] | undefined {
        // Check if the selected range includes the "content" prop
        const selectedText = document.getText(range);
        if (selectedText !== 'content') {
            return;
        }

        // Create a code action to suggest using the "children" prop instead
        const action = new vscode.CodeAction(
            'Use "children" prop',
            vscode.CodeActionKind.QuickFix
        );

        vscode.window.showInformationMessage('This component is written in a deprecated pattern');
        action.edit = new vscode.WorkspaceEdit();
        action.edit.replace(document.uri, range, 'children');

        return [action];
    }
}