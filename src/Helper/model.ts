import * as vscode from 'vscode';
export interface Pattern {
    name: string;
    errorMessage: string;
}

export interface Hook {
    name: string;
    range: vscode.Range;
}