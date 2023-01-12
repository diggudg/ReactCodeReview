import * as vscode from 'vscode';
import { Pattern } from './model';


export function getArrayPatternsFromSetting(): Pattern[] {
    // Get the JSON object from the VSCode settings
    const config = vscode.workspace.getConfiguration('reactCodeReview');
    const jsonObject: any = config.get('patterns');

    // Return the array of objects from the JSON object
    return jsonObject;
}

export function getArrayWordFromSetting(): Pattern[] {
    // Get the JSON object from the VSCode settings
    const config = vscode.workspace.getConfiguration('reactCodeReview');
    const jsonObject: any = config.get('words');

    // Return the array of objects from the JSON object
    return jsonObject;
}