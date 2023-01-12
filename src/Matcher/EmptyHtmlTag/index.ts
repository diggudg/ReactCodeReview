import * as vscode from 'vscode';
export default class EmptyHtmlTagMatcher {
    private pattern: RegExp;
    constructor() {
        // create a regular expression to match the empty html tags
        this.pattern = /><[^>]+>/g;
    }
    public findEmptyHtmlTags(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        let match;
        while ((match = this.pattern.exec(text)) !== null) {
            const range = new vscode.Range(
                document.positionAt(match.index),
                document.positionAt(match.index + match[0].length)
            );
            diagnostics.push(new vscode.Diagnostic(range, `Empty HTML tag ${match[1]}.`, vscode.DiagnosticSeverity.Warning));
        }
        return diagnostics;
    }
}