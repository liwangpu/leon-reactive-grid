import { ObjectTool } from './object-tool';

export class ExpressionTranslater {

    public static translateObjectExpression(scope: any, objectExpression: { [key: string]: any }): any {
        if (!objectExpression || !Object.keys(objectExpression).length) { return objectExpression; }
        return ExpressionTranslater.translateComplicatedObjectExpression(f => ObjectTool.recursionValueByField(scope, f), objectExpression);
    }

    public static translateUncertainExpression(getVariable: (k: string) => any, expression: { [key: string]: any } | string): any {
        let t: string = typeof expression;
        if (t === 'string') {
            return ExpressionTranslater.translateStringExpression(getVariable, expression as string);
        }

        return ExpressionTranslater.translateComplicatedObjectExpression(getVariable, expression as any);
    }

    public static translateComplicatedObjectExpression(getVariable: (k: string) => any, objectExpression: { [key: string]: any }): any {
        if (!objectExpression || !Object.keys(objectExpression).length) { return objectExpression; }
        let expression: string = JSON.stringify(objectExpression);
        // console.log('exp', expression);
        const reg: RegExp = /{{[\w.]+}}/ig;
        if (reg.test(expression)) {
            let exps: Array<string> = expression.match(reg);
            for (let exp of exps) {
                let variable: string = exp.match(/[\w.]+/i)[0];
                let v: any = getVariable(variable);
                const e: RegExp = new RegExp(`"\{\{${variable}\}\}"`, 'g');
                expression = expression.replace(e, v === null || v === undefined ? `null` : `${JSON.stringify(v)}`);
            }
        }
        return JSON.parse(expression);
    }

    public static translateStringExpression(getVariable: (k: string) => any, expression: string): string {
        if (typeof expression != 'string') { return expression; }

        const reg: RegExp = /{{[\w.]+}}/ig;
        if (reg.test(expression)) {
            let exps: Array<string> = expression.match(reg);
            for (let exp of exps) {
                let variable: string = exp.match(/[\w.]+/i)[0];
                let v: any = getVariable(variable);
                const e: RegExp = new RegExp(`\{\{${variable}\}\}`, 'g');
                expression = expression.replace(e, v === null || v === undefined ? `` : `${v}`);
            }
        }
        return expression;
    }

    public static excuteExpression(expression: string): boolean {
        if (!expression) { return false; }
        try {
            return eval(expression);
        } catch (err) {
            //
        }
        return false;
    }
}
