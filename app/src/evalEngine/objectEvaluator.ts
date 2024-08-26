import DataObject from '@/models/dataObject';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectTable from '../../../shared/src/models/metaObjectTable';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';
import DependencyInfo from '../../../shared/src/models/dependencyInfo';
import ExpressionEvaluator from '../../../shared/src/evalEngine/expressionEvaluator';
import { DependencyKinds } from '../../../shared/src/enums/dependencyKinds';

export default class ObjectEvaluator {
  logger: InMemoryLogger;
  settings: MetaObjectStorableSettings;
  dataObject: DataObject;
  dependenciesToCalc: any;

  constructor(
    logger: InMemoryLogger,
    settings: MetaObjectStorableSettings,
    dataObject: DataObject,
  ) {
    this.logger = logger;
    this.settings = settings;
    this.dataObject = dataObject;

    this.dependenciesToCalc = {};
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
    this.existingDependenciesEval(evaluator);
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
    this.existingDependenciesEval(evaluator);
  }

  onTableChanged(tableName: string, tableUid: string): void {
    this.logger.logDebug(`Table changed ${tableName}`);

    const tableSettings = this.settings.getTable(tableUid);
    if (!tableSettings) {
      this.logger.logError(`Cannot find table by uid: ${tableUid}`);
      return;
    }

    const evaluator = new ExpressionEvaluator(this.dataObject, this.logger);
    const columnsWithDependencies = tableSettings.columns.filter((x) => x.dependencies.length);

    columnsWithDependencies.forEach((column) => {
      column.dependencies.forEach((dependency) => {
        if (dependency.kind === DependencyKinds.HeaderField) {
          const headerField = this.settings.header.getColumn(dependency.fieldUid);
          if (headerField) {
            this.headerFieldEval(headerField, evaluator);
            this.headerDependenciesEval(headerField, evaluator);
          }
        }
      });
    });

    this.existingDependenciesEval(evaluator);
  }

  headerFieldEval(column: MetaObjectTableColumn, evaluator: ExpressionEvaluator): void {
    const calcResult = evaluator.evaluateExpression(column.formula);
    this.dataObject.header[column.name] = calcResult;
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
      if (dependency.kind === DependencyKinds.HeaderField) {
        // Calculate dependent formulas.
        const dependentColumn = this.settings.header.columns.find(
          (x) => x.uid === dependency.fieldUid,
        );
        if (!dependentColumn) {
          this.logger.logError(`Cannot find header column by uid: ${dependency.fieldUid}`);
        } else {
          this.headerFieldEval(dependentColumn, evaluator);
          this.headerDependenciesEval(dependentColumn, evaluator);
        }
      } else {
        // Calculate later.
        this.dependenciesToCalc[dependency.fieldUid] = dependency;
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
      if (dependency.kind === DependencyKinds.RowField) {
        // Calculate dependent fields.
        const dependentColumn = tableSettings.columns.find((x) => x.uid === dependency.fieldUid);
        if (!dependentColumn) {
          this.logger.logError(`Cannot find table column by uid: ${dependency.fieldUid}`);
        } else {
          row[dependentColumn.name] = evaluator.evaluateExpression(dependentColumn.formula);

          this.rowDependenciesEval(tableSettings, dependentColumn, row, evaluator);
        }
      } else {
        // Calculate later.
        this.dependenciesToCalc[dependency.fieldUid] = dependency;
      }
    });
  }

  existingDependenciesEval(evaluator: ExpressionEvaluator): void {
    this.logger.logDebug('DependenciesEval.Start');
    let dependencies = [];

    // eslint-disable-next-line no-restricted-syntax,guard-for-in
    for (const key in this.dependenciesToCalc) {
      dependencies.push(this.dependenciesToCalc[key]);
    }
    this.dependenciesToCalc = {};

    let flagContinue = dependencies.length > 0;
    const iMax = 3;
    let i = 0;

    while (flagContinue) {
      i += 1;
      this.logger.logDebug(`DependenciesEval.Iteration ${i}`);

      // Header dependencies.
      // eslint-disable-next-line no-restricted-syntax
      for (const dependency of dependencies.filter((x) => x.kind === DependencyKinds.HeaderField)) {
        const dependentColumn = this.settings.header.columns.find(
          (x) => x.uid === dependency.fieldUid,
        );

        if (!dependentColumn) {
          this.logger.logError(`Cannot find header column by uid: ${dependency.fieldUid}`);
        } else {
          const calcResult = evaluator.evaluateExpression(dependentColumn.formula);
          this.dataObject.header[dependentColumn.name] = calcResult;

          this.headerDependenciesEval(dependentColumn, evaluator);
        }
      }

      // Row dependencies.
      // eslint-disable-next-line no-restricted-syntax
      for (const dependency of dependencies.filter((x) => x.kind === DependencyKinds.RowField)) {
        const tableSettings = this.settings.detailTables.find(
          (x) => x.uid === dependency.tableUid,
        );
        if (!tableSettings) {
          this.logger.logError(`Cannot find table by uid: ${dependency.tableUid}`);
          return;
        }

        const column = tableSettings.columns.find(
          (x) => x.uid === dependency.fieldUid,
        );

        if (!column) {
          this.logger.logError(`Cannot find column by uid: ${dependency.fieldUid}`);
          return;
        }

        this.tableRecalculate(tableSettings, column, evaluator);
      }

      dependencies = [];
      // eslint-disable-next-line no-restricted-syntax,guard-for-in
      for (const key in this.dependenciesToCalc) {
        dependencies.push(this.dependenciesToCalc[key]);
      }
      flagContinue = dependencies.length > 0 && i <= iMax;
    }
  }

  tableRecalculate(
    tableSettings: MetaObjectTable,
    column: MetaObjectTableColumn,
    evaluator: ExpressionEvaluator,
  ): void {
    const table = this.dataObject.detailsTables.find(
      (x) => x.uid === tableSettings.uid,
    );

    if (!table) {
      this.logger.logError(`Cannot find table by uid: ${tableSettings.uid}`);
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const row of table.rows) {
      this.dataObject.currentRow = row;
      row[column.name] = evaluator.evaluateExpression(column.formula);
      this.rowDependenciesEval(tableSettings, column, row, evaluator);
    }
  }
}
