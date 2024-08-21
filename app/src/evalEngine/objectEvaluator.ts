import DataObject from '@/models/dataObject';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectTable from '../../../shared/src/models/metaObjectTable';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';
import DependencyInfo from '../../../shared/src/models/dependencyInfo';
import ExpressionEvaluator from '../../../shared/src/evalEngine/expressionEvaluator';

export default class ObjectEvaluator {
  logger: InMemoryLogger;
  settings: MetaObjectStorableSettings;
  dataObject: DataObject;

  constructor(
    logger: InMemoryLogger,
    settings: MetaObjectStorableSettings,
    dataObject: DataObject,
  ) {
    this.logger = logger;
    this.settings = settings;
    this.dataObject = dataObject;
  }

  onHeaderFieldChanged(columnName: string): void {
    this.logger.logDebug(`Header field changed "${columnName}"`);

    const column = this.settings.header.columns.find((x) => x.name === columnName);
    if (!column) {
      this.logger.logError(`Cannot find column by name: ${columnName}`);
      console.log('HeaderColumns', JSON.stringify(this.settings));
      return;
    }

    this.dataObject.currentRow = {};
    const evaluator = new ExpressionEvaluator(this.dataObject, this.logger);
    this.headerDependenciesEval(column, evaluator);
  }

  onRowFieldChanged(fieldName: string, tableUid: string, row: any): void {
    this.logger.logDebug(`Row field changed ${fieldName}. TableUid: ${tableUid}`);

    const tableSettings = this.settings.detailTables.find((x) => x.uid === tableUid);
    if (!tableSettings) {
      this.logger.logError(`Cannot find table by uid: ${tableUid}`);
      return;
    }

    const column = tableSettings.columns.find((x) => x.name === fieldName);

    if (!column) {
      this.logger.logError(`Cannot find column by name: ${fieldName}`);
      return;
    }

    this.dataObject.currentRow = row;
    const evaluator = new ExpressionEvaluator(this.dataObject, this.logger);

    this.rowDependenciesEval(tableSettings, column, row, evaluator);
  }

  headerDependenciesEval(
    columnSettings: MetaObjectTableColumn,
    evaluator: ExpressionEvaluator,
  ):void {
    if (!columnSettings.dependencies) {
      return;
    }

    if (!columnSettings.dependencies.length) {
      return;
    }

    columnSettings.dependencies.forEach((dependency: DependencyInfo) => {
      const dependentColumn = this.settings.header.columns.find(
        (x) => x.uid === dependency.fieldUid,
      );
      if (!dependentColumn) {
        this.logger.logError(`Cannot find column by uid: ${dependency.fieldUid}`);
      } else {
        const calcResult = evaluator.evaluateExpression(dependentColumn.formula);
        this.dataObject.header[dependentColumn.name] = calcResult;

        this.headerDependenciesEval(dependentColumn, evaluator);
      }
    });
  }

  rowDependenciesEval(
    tableSettings: MetaObjectTable,
    columnSettings: MetaObjectTableColumn,
    row: any,
    evaluator: ExpressionEvaluator,
  ):void {
    if (!columnSettings.dependencies) {
      return;
    }

    if (!columnSettings.dependencies.length) {
      return;
    }

    columnSettings.dependencies.forEach((dependency: DependencyInfo) => {
      const dependentColumn = tableSettings.columns.find((x) => x.uid === dependency.fieldUid);
      if (!dependentColumn) {
        this.logger.logError(`Cannot find column by uid: ${dependency.fieldUid}`);
      } else {
        row[dependentColumn.name] = evaluator.evaluateExpression(dependentColumn.formula);

        this.rowDependenciesEval(tableSettings, dependentColumn, row, evaluator);
      }
    });
  }
}
