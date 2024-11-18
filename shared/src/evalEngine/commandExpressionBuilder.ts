import ExpressionHelper from './expressionHelper';

export default class CommandExpressionBuilder {
  static BuildFillCommandExpression(dataSource: string, tableName: string, clear: boolean): string {
    const expression = `${ExpressionHelper.buildExecuteDataSourceFunction(dataSource)};
    var source = await executeDataSource();
    $t.${tableName}.${clear ? 'clear().' : ''}load(source);`;

    return expression;
  }

  static BuildPickUpCommandExpression(dataSource: string, tableName: string): string {
    const expression = `${ExpressionHelper.buildExecuteDataSourceFunction(dataSource)};
   var source = ${dataSource};
   openPickUp(source, '${tableName}');`;

    return expression;
  }
}
