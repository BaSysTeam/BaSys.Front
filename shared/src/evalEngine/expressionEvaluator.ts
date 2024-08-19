import InMemoryLogger from '../models/inMemoryLogger';

export default class ExpressionEvaluator {
  context: any;
  logger: InMemoryLogger;

  constructor(context:any, logger:InMemoryLogger) {
    this.context = context;
    this.logger = logger;
  }

  evaluateExpression(expression:string): any {
    let result: any;
    try {
      // eslint-disable-next-line no-eval
      result = eval(expression);

      this.logger.logDebug(`Calculated. Expression: ${expression}, result:${result}`);
    } catch (e) {
      result = null;
      this.logger.logError(`Calculation error. Formula: ${expression}. Message: ${e}`);
    }

    return result;
  }
}
