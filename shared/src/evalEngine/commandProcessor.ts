import { DbType as DbTypeEnum } from '../enums/dbTypes';
import InMemoryLogger from '../models/inMemoryLogger';
import ExpressionHelper from './expressionHelper';
import FunctionLibrary from './functionLibrary';

export default class CommandProcessor {
  context: any;
  logger: InMemoryLogger;
  error: any;
  additionalFunctions: any;

  constructor(context: any, additionalFunctions: any, logger: InMemoryLogger) {
    this.context = context;
    this.additionalFunctions = additionalFunctions;
    this.logger = logger;
    this.error = undefined;
  }

  async executeAsync(expression: string): Promise<any> {
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
      dateTimeNow,
      dateDifference,
    } = FunctionLibrary;

    const {
      isModified,
      isWaiting,
      recalculate,
      save,
      close,
      refresh,
    } = this.additionalFunctions;

    const DbType = DbTypeEnum;

    let result: any;
    this.error = null;

    const asyncCode = ExpressionHelper.addAsyncWrapper(expression);

    try {
      // eslint-disable-next-line no-eval
      result = await eval(asyncCode);

      this.logDebug(`Calculated. Expression: ${asyncCode}, result:${result}.`);
    } catch (e) {
      result = null;
      this.error = e;
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
