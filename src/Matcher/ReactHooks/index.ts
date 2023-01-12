import * as ts from 'typescript';
import * as vscode from 'vscode';
import { Hook } from '../../Helper/model';
export default class ReactHooksMatcher {
    constructor() {
    }

    public findHooks(
        document: vscode.TextDocument,
        tsModule: typeof ts,
        hookNames: string
    ): Hook[] {
        const sourceFile = tsModule.createSourceFile(
            document.fileName,
            document.getText(),
            tsModule.ScriptTarget.Latest,
            true
        );

        const hooks: Hook[] = [];
        const hookNameSet = new Set(hookNames.split(',').map((s) => s.trim()));

        function visit(node: ts.Node) {
            if (tsModule.isIdentifier(node) && hookNameSet.has(node.text)) {
                if (
                    tsModule.isPropertyAccessExpression(node.parent) &&
                    node.parent.expression.getText() === 'React'
                ) {
                    hooks.push({
                        name: node.text,
                        range: new vscode.Range(
                            document.positionAt(node.getStart()),
                            document.positionAt(node.getEnd())
                        ),
                    });
                }
            } else {
                tsModule.forEachChild(node, visit);
            }
        }

        tsModule.forEachChild(sourceFile, visit);

        return hooks;
    }

    // public findHooks(document: vscode.TextDocument, tsModule: typeof ts): Hook[] {
    //     const sourceFile = tsModule.createSourceFile(
    //         document.fileName,
    //         document.getText(),
    //         tsModule.ScriptTarget.Latest,
    //         true
    //     );

    //     const hooks: Hook[] = [];

    //     const hooksNeedToBeImported = ['useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, useImperativeHandle, useLayoutEffect, useDebugValue'];
    //     function visit(node: ts.Node) {
    //         if (tsModule.isIdentifier(node) && hooksNeedToBeImported.includes(node.text)) {
    //             if (tsModule.isPropertyAccessExpression(node.parent) && node.parent.expression.getText() === 'React') {
    //                 hooks.push({
    //                     name: hooksNeedToBeImported[node.text as keyof typeof hooksNeedToBeImported] as string,
    //                     range: new vscode.Range(
    //                         document.positionAt(node.getStart()),
    //                         document.positionAt(node.getEnd())
    //                     ),
    //                 });
    //             }
    //         } else {
    //             tsModule.forEachChild(node, visit);
    //         }
    //         hooksNeedToBeImported.forEach((hook) => {

    //         });
    //     }

    //     tsModule.forEachChild(sourceFile, visit);

    //     return hooks;
    // }
}

