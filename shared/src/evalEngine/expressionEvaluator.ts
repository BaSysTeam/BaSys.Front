import ExpressionHelper from './expressionHelper';
import FunctionLibrary from './functionLibrary';
import InMemoryLogger from '../models/inMemoryLogger';

export default class ExpressionEvaluator {
  context: any;
  logger: InMemoryLogger;

  constructor(context:any, logger:InMemoryLogger) {
    this.context = context;
    this.logger = logger;
  }

  evaluateExpression(expression:string): any {
    const $r = this.context.currentRow;
    const $h = this.context.header;
    const $t = this.context.tables;
    const {
      isEmpty,
      isNotEmpty,
      iif,
      ifs,
      createTable,
      from,
    } = FunctionLibrary;

    let result: any;

    try {
      // eslint-disable-next-line no-eval
      result = eval(expression);

      this.logDebug(`Calculated. Expression: ${expression}, result:${result}.`);
    } catch (e) {
      result = null;
      this.logError(`Calculation error. Formula: ${expression}. Message: ${e}.`);
    }

    return result;
  }

  async evaluateAsyncExpression(expression:string): Promise<any> {
    const $r = this.context.currentRow;
    const $h = this.context.header;
    const $t = this.context.tables;
    const {
      isEmpty,
      isNotEmpty,
      iif,
      ifs,
      createTable,
      from,
    } = FunctionLibrary;

    let result: any;

    const asyncCode = ExpressionHelper.prepareAsyncExpression(expression);

    try {
      // eslint-disable-next-line no-eval
      result = await eval(asyncCode);

      this.logDebug(`Calculated. Expression: ${asyncCode}, result:${result}.`);
    } catch (e) {
      result = null;
      this.logError(`Calculation error. Formula: ${asyncCode}. Message: ${e}.`);
    }

    return result;
  }

  logDebug(text: string): void {
    if (!this.logger) {
      return;
    }
    this.logger.logDebug(text);
  }

  logError(text: string): void {
    if (!this.logger) {
      return;
    }
    this.logger.logError(text);
  }
}
