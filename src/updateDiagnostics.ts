import * as vscode from 'vscode';

export function updateDiagnostics(diagnosticCollection: vscode.DiagnosticCollection, currentFileName: string | undefined, warnings: vscode.Diagnostic[]) {
	//diagnosticCollection.clear();
	diagnosticCollection.set(vscode.Uri.file(currentFileName || ''), warnings);
}
