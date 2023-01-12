import * as vscode from 'vscode';
import * as ts from 'typescript';
import { Hook, Pattern } from './Helper/model';
import EmptyHtmlTagMatcher from './Matcher/EmptyHtmlTag';


let diagnosticCollection: vscode.DiagnosticCollection;
let currentFileName: string;
let foundEmptyHtmlTags: vscode.Diagnostic[];

const patternsFromSetting: Pattern[] = vscode.workspace.getConfiguration('reactCodeReview').get('patterns') || [];

export function activate  (context: vscode.ExtensionContext)  {
	diagnosticCollection = vscode.languages.createDiagnosticCollection('reactcodereview');
	currentFileName = vscode.window.activeTextEditor?.document.fileName||'';

	const emptyHtmlTagMatcher = new EmptyHtmlTagMatcher();
	foundEmptyHtmlTags = vscode.window.activeTextEditor?.document && emptyHtmlTagMatcher.findEmptyHtmlTags(vscode.window.activeTextEditor?.document)||[];
	updateDiagnostics(vscode.window.activeTextEditor);

	vscode.window.onDidChangeActiveTextEditor((textEditor) => {
		updateDiagnostics(textEditor);
	});

	vscode.workspace.onDidSaveTextDocument((_textDocument) => {
        const warnings = initializeExtension(vscode.window.activeTextEditor, foundEmptyHtmlTags);
        diagnosticCollection.clear();
        if (currentFileName) {
            diagnosticCollection.set(vscode.Uri.file(currentFileName), warnings);
        }
	});

};

const updateDiagnostics = (textEditor: vscode.TextEditor | undefined) => {
	currentFileName = textEditor?.document.fileName||'';
	const warnings = initializeExtension(textEditor, foundEmptyHtmlTags);
	diagnosticCollection.clear();
	if (currentFileName) {
		diagnosticCollection.set(vscode.Uri.file(currentFileName), warnings);
	}
};
const initializeExtension = (textEditor: vscode.TextEditor | undefined, foundEmptyHtmlTags: vscode.Diagnostic[] | undefined) => {
	const diagnostics: vscode.Diagnostic[] = [];
	const warningForHooks =vscode.window.activeTextEditor?.document && 
     findHooks(vscode.window.activeTextEditor) || [];
	diagnostics.push(...warningForHooks);

	const warningsForHtml = findEmptyHtmlTags(foundEmptyHtmlTags) || [];
	diagnostics.push(...warningsForHtml);
	return diagnostics;
};

function findEmptyHtmlTags(foundEmptyHtmlTags: vscode.Diagnostic[] | undefined) {
	if (!foundEmptyHtmlTags) {
		return [];
	}

const emptyHtmlTagMatcher = new EmptyHtmlTagMatcher();
foundEmptyHtmlTags = vscode.window.activeTextEditor?.document && emptyHtmlTagMatcher.findEmptyHtmlTags(vscode.window.activeTextEditor?.document)||[];

return foundEmptyHtmlTags;
}
function findHooks(textEditor: vscode.TextEditor): vscode.Diagnostic[] {
    const document = textEditor.document;
    const sourceFile = ts.createSourceFile(
        document.fileName,
        document.getText(),
        ts.ScriptTarget.Latest,
        true
    );
    const hookNames = ['useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 'useDebugValue']; // or get it from the configuration
    const hookNameSet = new Set(hookNames);
    const hooks: vscode.Diagnostic[] = [];
    function visit(node: ts.Node) {
        if (ts.isIdentifier(node) && hookNameSet.has(node.text)) {
            if (
                ts.isPropertyAccessExpression(node.parent) &&
                node.parent.expression.getText() === 'React'
            ) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(
                        document.positionAt(node.getStart()),
                        document.positionAt(node.getEnd())
                    ),
                    `${node.text} is a React Hook.` ,
                    vscode.DiagnosticSeverity.Warning
                );
                diagnostic.source = 'reactcodereview';
                hooks.push(diagnostic);
            }
        } else {
            ts.forEachChild(node, visit);
        }
    }
    ts.forEachChild(sourceFile, visit);
    return hooks;
}
