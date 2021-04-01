import { executeInPage, computeSelector } from "../utils/utils";
import { AbstractEditor } from "./AbstractEditor";

export class AceEditor extends AbstractEditor {

    static matches (e: HTMLElement) {
        let parent = e;
        for (let i = 0; i < 3; ++i) {
            if (parent !== undefined && parent !== null) {
                if ((/ace_editor/gi).test(parent.className)) {
                    return true;
                }
                parent = parent.parentElement;
            }
        }
        return false;
    }

    private elem: HTMLElement;
    constructor (e: HTMLElement) {
        super();
        this.elem = e;
        // Get the topmost ace element
        let parent = this.elem.parentElement;
        while (AceEditor.matches(parent)) {
            this.elem = parent;
            parent = parent.parentElement;
        }
    }

    getContent () {
        return executeInPage(`(${/* istanbul ignore next */ (selec: string) => {
            const elem = document.querySelector(selec) as any;
            let win_ace = (window as any).ace;
            let ace;
            if (win_ace !== undefined) {
                ace = win_ace.edit(elem);
            } else if (elem.hasOwnProperty('aceEditor')) {
                ace = elem.aceEditor;
            } else {
                throw new Error("Couldn't find AceEditor instance");
            }
            return ace.getValue();
        }})(${JSON.stringify(computeSelector(this.elem))})`);
    }

    getCursor () {
        return executeInPage(`(${/* istanbul ignore next */ (selec: string) => {
            let position;
            const elem = document.querySelector(selec) as any;
            let win_ace = (window as any).ace;
            let ace;
            if (win_ace !== undefined) {
                ace = win_ace.edit(elem);
            } else if (elem.hasOwnProperty('aceEditor')) {
                ace = elem.aceEditor;
            } else {
                throw new Error("Couldn't find AceEditor instance");
            }
            if (ace.getCursorPosition !== undefined) {
                position = ace.getCursorPosition();
            } else {
                position = ace.selection.cursor;
            }
            return [position.row + 1, position.column];
        }})(${JSON.stringify(computeSelector(this.elem))})`);
    }

    getElement () {
        return this.elem;
    }

    getLanguage () {
        return executeInPage(`(${/* istanbul ignore next */ (selec: string) => {
            const elem = document.querySelector(selec) as any;
            let win_ace = (window as any).ace;
            let ace;
            if (win_ace !== undefined) {
                ace = win_ace.edit(elem);
            } else if (elem.hasOwnProperty('aceEditor')) {
                ace = elem.aceEditor;
            } else {
                throw new Error("Couldn't find AceEditor instance");
            }
            return ace.session.$modeId.split("/").slice(-1)[0];
        }})(${JSON.stringify(computeSelector(this.elem))})`);
    }

    setContent (text: string) {
        return executeInPage(`(${/* istanbul ignore next */ (selec: string, str: string) => {
            const elem = document.querySelector(selec) as any;
            let win_ace = (window as any).ace;
            let ace;
            if (win_ace !== undefined) {
                ace = win_ace.edit(elem);
            } else if (elem.hasOwnProperty('aceEditor')) {
                ace = elem.aceEditor;
            } else {
                throw new Error("Couldn't find AceEditor instance");
            }
            return ace.setValue(str, 1);
        }})(${JSON.stringify(computeSelector(this.elem))}, ${JSON.stringify(text)})`);
    }

    setCursor (line: number, column: number) {
        return executeInPage(`(${/* istanbul ignore next */ (selec: string, l: number, c: number) => {
            const elem = document.querySelector(selec) as any;
            let win_ace = (window as any).ace;
            let ace;
            if (win_ace !== undefined) {
                ace = win_ace.edit(elem);
            } else if (elem.hasOwnProperty('aceEditor')) {
                ace = elem.aceEditor;
            } else {
                throw new Error("Couldn't find AceEditor instance");
            }
            const selection = ace.getSelection();
            return selection.moveCursorTo(l - 1, c, false);
        }})(${JSON.stringify(computeSelector(this.elem))}, ${line}, ${column})`);
    }

}
