import ExpressionEvaluator from '@/evalEngine/expressionEvaluator';
import InMemoryLogger from '@/models/inMemoryLogger';
import { LogLevels } from '@/enums/logLevels';

describe('ExpressionEvaluator', () => {
  it('Calculate price', () => {
    const context = {
      currentRow: {
        product: 1,
        quantity: 5,
        price: 100,
        amount: 0,
      },
    };
    const logger = new InMemoryLogger(LogLevels.Debug);
    const evaluator = new ExpressionEvaluator(context, logger);
    const expression = 'this.context.currentRow.quantity * this.context.currentRow.price';
    const result = evaluator.evaluateExpression(expression);

    console.log('expression', expression);
    console.log('result', result);
    console.log('messages:');
    evaluator.logger.messages.forEach((logMessage) => {
      console.log(logMessage.toString());
    });
    expect(result).toEqual(500);
  });

  it('Calculate price by shortcuts', () => {
    const context = {
      currentRow: {
        product: 1,
        quantity: 5,
        price: 100,
        amount: 0,
      },
    };
    const logger = new InMemoryLogger(LogLevels.Debug);
    const evaluator = new ExpressionEvaluator(context, logger);
    const expression = '$r.quantity * $r.price';
    const result = evaluator.evaluateExpression(expression);

    console.log('expression', expression);
    console.log('result', result);
    console.log('messages:');
    evaluator.logger.messages.forEach((logMessage) => {
      console.log(logMessage.toString());
    });
    expect(result).toEqual(500);
  });
});
