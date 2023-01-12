import * as vscode from 'vscode';
import * as fs from 'fs';
import { Pattern } from '../Helper/model';
export default class ReactPatternMatches {
    constructor() {

    }

    public getPatternMatches(patternToMatch: Pattern) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const diagnostics: vscode.Diagnostic[] = [];
        const document = editor.document;
        const text = document.getText();
        const pattern = new RegExp(patternToMatch.name, 'g');
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(match => {
                const matchIndex = text.indexOf(match);
                const matchLine = document.positionAt(matchIndex).line;
                const matchRange = document.lineAt(matchLine).range;
                const diagnostic = new vscode.Diagnostic(matchRange, patternToMatch.errorMessage, vscode.DiagnosticSeverity.Information);
                diagnostics.push(diagnostic);
            });
        }

        return diagnostics;
    }
    public getPatternMatch(patternsFromSetting: Pattern[]) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const diagnostics: vscode.Diagnostic[] = [];
        const document = editor.document;
        const text = document.getText();

        patternsFromSetting?.forEach((regex: Pattern) => {

            const pattern = new RegExp(regex.name, 'g');
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    const matchIndex = text.indexOf(match);
                    const matchLine = document.positionAt(matchIndex).line;
                    const matchRange = document.lineAt(matchLine).range;
                    const diagnostic = new vscode.Diagnostic(matchRange, regex.errorMessage, vscode.DiagnosticSeverity.Information);
                    diagnostics.push(diagnostic);
                });
            }

        });
        return diagnostics;
    }
}