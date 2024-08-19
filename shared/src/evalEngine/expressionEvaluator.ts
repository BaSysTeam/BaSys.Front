import InMemoryLogger from '../models/inMemoryLogger';

export default class ExpressionEvaluator {
  context: any;
  logger: InMemoryLogger;

  constructor(context:any, logger:InMemoryLogger) {
    this.context = context;
    this.logger = logger;
  }

  evaluateExpression(expression:string): any {
    // eslint-disable-next-line no-eval
    const result = eval(expression);

    return result;
  }
}
