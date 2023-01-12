// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ts from 'typescript';
import ReactPatternMatches from './ReactPatternMatches';
import { Pattern } from './Helper/model';
import ReactHooksMatcher from './Matcher/ReactHooks';
import EmptyHtmlTagMatcher from './Matcher/EmptyHtmlTag';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const diagnosticCollection: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('reactcodereview');
	let currentFileName = vscode.window.activeTextEditor?.document.fileName;


	const patternsFromSetting: Pattern[] = vscode.workspace.getConfiguration('reactCodeReview').get('patterns') || [];

	// const warningForHooks = findHooks(vscode.window.activeTextEditor) || [];
	// diagnostics.push(...warningForHooks);

	// Find empty html tags
	const emptyHtmlTagMatcher = new EmptyHtmlTagMatcher();
	const foundEmptyHtmlTags = vscode.window.activeTextEditor?.document && emptyHtmlTagMatcher.findEmptyHtmlTags(vscode.window.activeTextEditor?.document);

	// const warningsForHtml = findEmptyHtmlTags(foundEmptyHtmlTags) || [];
	// diagnostics.push(...warningsForHtml);
	const warnings = intializeExtension(vscode.window.activeTextEditor, foundEmptyHtmlTags);
	updateDiagnostics(diagnosticCollection, currentFileName, warnings);

	vscode.window.onDidChangeActiveTextEditor((textDocument) => {

		const warnings = intializeExtension(textDocument, foundEmptyHtmlTags);
		updateDiagnostics(diagnosticCollection, currentFileName, warnings);

	});

	// vscode.workspace.onDidChangeTextDocument((event) => {
	// 	const warnings = intializeExtension(vscode.window.activeTextEditor, diagnostics, foundEmptyHtmlTags);
	// 	// const warningForHooks = findHooks(vscode.window.activeTextEditor) || [];
	// 	// //diagnostics.push(...warningForHooks);
	// 	// diagnosticCollection.set(vscode.Uri.file(currentFileName || ''), { ...diagnostics, ...warningForHooks });
	// 	// const warningsForHtml = findEmptyHtmlTags(foundEmptyHtmlTags) || [];
	// 	// //diagnostics.push(...warningsForHtml);
	// 	diagnosticCollection.delete(vscode.Uri.file(currentFileName || ''));
	// 	diagnosticCollection.set(vscode.Uri.file(currentFileName || ''), warnings);
	// });


	vscode.workspace.onDidSaveTextDocument((textDocument) => {
		vscode.window.showInformationMessage('Your file has been saved!');
		const warnings = intializeExtension(vscode.window.activeTextEditor, foundEmptyHtmlTags);
		// const warningForHooks = findHooks(vscode.window.activeTextEditor) || [];
		// //diagnostics.push(...warningForHooks);
		// diagnosticCollection.set(vscode.Uri.file(currentFileName || ''), { ...diagnostics, ...warningForHooks });

		// const warningsForHtml = findEmptyHtmlTags(foundEmptyHtmlTags) || [];
		// diagnosticCollection.set(vscode.Uri.file(currentFileName || ''), { ...diagnostics, ...warningsForHtml });
		//diagnostics.push(...warningsForHtml);
		updateDiagnostics(diagnosticCollection, currentFileName, warnings);

	});

	//diagnosticCollection.set(vscode.Uri.file(currentFileName || ''), diagnostics);

}

function updateDiagnostics(diagnosticCollection: vscode.DiagnosticCollection, currentFileName: string | undefined, warnings: vscode.Diagnostic[]) {
	diagnosticCollection.clear();
	diagnosticCollection.set(vscode.Uri.file(currentFileName || ''), warnings);
}

function intializeExtension(textDocument: vscode.TextEditor | undefined, foundEmptyHtmlTags: vscode.Diagnostic[] | undefined) {
	const diagnostics: vscode.Diagnostic[] = []; // Map<fileName, diagnostics[]>
	const warningForHooks = findHooks(textDocument) || [];
	diagnostics.push(...warningForHooks);

	const warningsForHtml = findEmptyHtmlTags(foundEmptyHtmlTags) || [];
	diagnostics.push(...warningsForHtml);
	return diagnostics;
}

function findEmptyHtmlTags(foundEmptyHtmlTags: vscode.Diagnostic[] | undefined) {
	return foundEmptyHtmlTags && foundEmptyHtmlTags.map((a) => {
		const diagnostic = new vscode.Diagnostic(a.range, a.message, vscode.DiagnosticSeverity.Warning);
		diagnostic.source = 'reactcodereview';
		return diagnostic;
	});
}

function findHooks(textDocument: vscode.TextEditor | undefined) {
	const reactHooksMatcher = new ReactHooksMatcher();
	const foundHooks = textDocument?.document && reactHooksMatcher.findHooks(
		textDocument?.document,
		ts,
		'useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, useImperativeHandle, useLayoutEffect, useDebugValue'
	);//findHooks(textDocument?.document, ts);

	return foundHooks && foundHooks.map((a) => {
		const diagnostic = new vscode.Diagnostic(a.range, "Please use named imports from React.", vscode.DiagnosticSeverity.Warning);
		diagnostic.source = 'reactcodereview';
		return diagnostic;
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }
