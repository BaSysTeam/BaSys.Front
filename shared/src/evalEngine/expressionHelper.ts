export default class ExpressionHelper {
  static addAsyncWrapper(expression: string): string {
    return `(async () => {  ${expression} })()`;
  }

  static isSingleLine(lines: string[]): boolean {
    if (lines.length <= 1) {
      // One line.
      return true;
    }

    if (lines.length === 2 && !lines[1]) {
      // Two lines and Last line is empty.
      return true;
    }

    return false;
  }

  static addReturnToLine(line: string): string {
    if (!line) {
      return line;
    }

    if (line[0] === '\n') {
      return `\nreturn ${line.substring(1, line.length)}`;
    }

    return `return ${line}`;
  }

  static addReturnStatement(expression: string): string {
    if (!expression) {
      return expression;
    }

    if (expression.includes('return')) {
      return expression;
    }

    const lines = expression.split(';');

    if (ExpressionHelper.isSingleLine(lines)) {
      return `return ${expression}`;
    }

    const lastLine = lines[lines.length - 1];
    if (lastLine) {
      lines[lines.length - 1] = ExpressionHelper.addReturnToLine(lines[lines.length - 1]);
    } else if (lines.length > 2) {
      lines[lines.length - 2] = ExpressionHelper.addReturnToLine(lines[lines.length - 2]);
    }

    return lines.join(';');
  }

  static prepareAsyncExpression(expression: string): string {
    return ExpressionHelper.addAsyncWrapper(ExpressionHelper.addReturnStatement(expression));
  }

  static buildExecuteDataSourceFunction(dataSource: string): string {
    const expression = `async function executeDataSource(){
    ${ExpressionHelper.addReturnStatement(dataSource)}
    }`;
    return expression;
  }
}
