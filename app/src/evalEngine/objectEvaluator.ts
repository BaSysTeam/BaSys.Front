import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import DependencyInfo from '../../../shared/src/models/dependencyInfo';
import ExpressionEvaluator from '../../../shared/src/evalEngine/expressionEvaluator';

export default class ObjectEvaluator {
  logger: InMemoryLogger;
  settings: MetaObjectStorableSettings;

  constructor(logger: InMemoryLogger, settings: MetaObjectStorableSettings) {
    this.logger = logger;
    this.settings = settings;
  }

  onRowFieldChanged(fieldName: string, tableUid: string, row: any): void {
    this.logger.logDebug(`Row field changed ${fieldName}. TableUid: ${tableUid}`);

    const tableSettings = this.settings.detailTables.find((x) => x.uid === tableUid);
    if (!tableSettings) {
      return;
    }

    const column = tableSettings.columns.find((x) => x.name === fieldName);

    if (!column) {
      return;
    }

    const context = {
      header: {},
      currentRow: row,
    };

    const evaluator = new ExpressionEvaluator(context, this.logger);

    // eslint-disable-next-line no-restricted-syntax,guard-for-in
    for (const dependency of column.dependencies) {
      const dependentColumn = tableSettings.columns.find((x) => x.uid === dependency.fieldUid);
      if (!dependentColumn) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const result = evaluator.evaluateExpression(dependentColumn.formula);
      row[dependentColumn.name] = result;
    }
  }
}
