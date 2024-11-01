/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import DataObject from '@/models/dataObject';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectTable from '../../../shared/src/models/metaObjectTable';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';
import ExpressionEvaluator from '../../../shared/src/evalEngine/expressionEvaluator';
import { DependencyKinds } from '../../../shared/src/enums/dependencyKinds';

export default class ObjectEvaluator {
  private static readonly MAX_ITERATIONS = 3;

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

  /**
   * Handle changes of a header field. Recalculates formulas in header and tables
   * according dependencies.
   * @param name - name of field was changed.
   */
  async onHeaderFieldChangedAsync(name: string): Promise<void> {
    this.logger.logDebug(`Header field changed "${name}"`);

    const column = this.settings.header.getColumnByName(name);
    if (!column) {
      this.logger.logError(`Cannot find column by name: ${name}`);
      return;
    }

    this.dataObject.currentRow = {};
    const evaluator = new ExpressionEvaluator(this.dataObject, this.logger);
    await this.headerDependenciesEvalAsync(column, evaluator);
    await this.existingDependenciesEvalAsync(evaluator);
  }

  /**
   * Handle changes of field value in table row. Recalculates formulas in row and header
   * according formula dependencies.
   * @param fieldName - name of field was changed.
   * @param tableUid - uid of table.
   * @param row - current row of table.
   */
  async onRowFieldChangedAsync(fieldName: string, tableUid: string, row: any): Promise<void> {
    this.logger.logDebug(`Row field changed ${fieldName}. TableUid: ${tableUid}`);

    const tableSettings = this.settings.getTable(tableUid);
    if (!tableSettings) {
      this.logger.logError(`Cannot find table by uid: ${tableUid}`);
      return;
    }
    const column = tableSettings.getColumnByName(fieldName);

    if (!column) {
      this.logger.logError(`Cannot find column by name: ${fieldName}`);
      return;
    }

    this.dataObject.currentRow = row;
    const evaluator = new ExpressionEvaluator(this.dataObject, this.logger);

    await this.rowDependenciesEvalAsync(tableSettings, column, row, evaluator);
    await this.existingDependenciesEvalAsync(evaluator);
  }

  /**
   * Handle table changed: add or remove rows. Recalculates formulas according dependencies.
   * @param tableName - name of table was changed
   * ( tableName is necessary for good log messages only).
   * @param tableUid - uid of table was changed.
   */
  async onTableChangedAsync(tableName: string, tableUid: string): Promise<void> {
    this.logger.logDebug(`Table changed "${tableName}"`);

    const tableSettings = this.settings.getTable(tableUid);
    if (!tableSettings) {
      this.logger.logError(`Cannot find table by uid: ${tableUid}`);
      return;
    }

    const evaluator = new ExpressionEvaluator(this.dataObject, this.logger);
    const columnsWithDependencies = tableSettings.columns.filter((x) => x.dependencies.length);

    for (const column of columnsWithDependencies) {
      for (const dependency of column.dependencies) {
        if (dependency.kind === DependencyKinds.HeaderField) {
          const headerField = this.settings.header.getColumn(dependency.fieldUid);
          if (headerField) {
            await this.headerFieldEvalAsync(headerField, evaluator);
            await this.headerDependenciesEvalAsync(headerField, evaluator);
          }
        }
      }
    }

    await this.existingDependenciesEvalAsync(evaluator);
  }

  /**
   * Recalculates all formulas in object.
   */
  async onObjectRecalculateAsync(): Promise<void> {
    this.logger.logDebug('Object recalculate');

    // Eval all formulas in header fields.
    const evaluator = new ExpressionEvaluator(this.dataObject, this.logger);

    for (const column of this.settings.header.columns) {
      await this.headerDependenciesEvalAsync(column, evaluator);
    }

    // Eval all formulas in all rows in all tables.
    // eslint-disable-next-line guard-for-in
    for (const key in this.dataObject.tables) {
      const table = this.dataObject.tables[key];
      const tableSettings = this.settings.getTable(table.uid);
      if (tableSettings) {
        for (const row of table.rows) {
          this.dataObject.currentRow = row;
          this.logger.logDebug(`Recalculate row #${row.row_number} in table "${table.name}"`);
          for (const column of tableSettings.columns) {
            await this.rowDependenciesEvalAsync(tableSettings, column, row, evaluator);
          }
        }
      }
    }

    await this.existingDependenciesEvalAsync(evaluator);
  }

  async onTableRecalculateAsync(tableName: string): Promise<void> {
    const table = this.dataObject.tables[tableName];
    if (!table) {
      this.logger.logError(`Cannot find table: ${tableName}`);
      return;
    }
    const tableSettings = this.settings.getTable(table.uid);
    if (tableSettings) {
      const evaluator = new ExpressionEvaluator(this.dataObject, this.logger);
      for (const row of table.rows) {
        this.dataObject.currentRow = row;
        this.logger.logDebug(`Recalculate row #${row.row_number} in table "${table.name}"`);
        for (const column of tableSettings.columns) {
          await this.rowDependenciesEvalAsync(tableSettings, column, row, evaluator);
        }
      }

      await this.existingDependenciesEvalAsync(evaluator);
    }
  }

  /**
   * Recalculates all formulas in table row and dependent formulas.
   * @param tableName - name of table (it is necessary only for good-looking log message)
   * @param tableUid - uid of table
   * @param row - row of the table which need to recalculate.
   */
  async onRowRecalculateAsync(tableName: string, tableUid: string, row: any): Promise<void> {
    this.logger.logDebug(`Row #${row.row_number} recalculate in table "${tableName}"`);

    const tableSettings = this.settings.getTable(tableUid);
    if (!tableSettings) {
      this.logger.logError(`Cannot find table by uid: ${tableUid}`);
      return;
    }

    this.dataObject.currentRow = row;
    const evaluator = new ExpressionEvaluator(this.dataObject, this.logger);

    for (const column of tableSettings.columns) {
      await this.rowDependenciesEvalAsync(tableSettings, column, row, evaluator);
    }

    await this.existingDependenciesEvalAsync(evaluator);
  }

  private async headerFieldEvalAsync(
    column: MetaObjectTableColumn,
    evaluator: ExpressionEvaluator,
  ): Promise<void> {
    this.dataObject.header[column.name] = await evaluator.evaluateExpressionAsync(column.formula);
  }

  private async headerDependenciesEvalAsync(
    columnSettings: MetaObjectTableColumn,
    evaluator: ExpressionEvaluator,
  ):Promise<void> {
    if (!columnSettings.dependencies) {
      return;
    }

    if (!columnSettings.dependencies.length) {
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const dependency of columnSettings.dependencies) {
      if (dependency.kind === DependencyKinds.HeaderField) {
        // Calculate dependent formulas.
        const dependentColumn = this.settings.header.columns.find(
          (x) => x.uid === dependency.fieldUid,
        );
        if (!dependentColumn) {
          this.logger.logError(`Cannot find header column by uid: ${dependency.fieldUid}`);
        } else {
          // eslint-disable-next-line no-await-in-loop
          await this.headerFieldEvalAsync(dependentColumn, evaluator);
          // eslint-disable-next-line no-await-in-loop
          await this.headerDependenciesEvalAsync(dependentColumn, evaluator);
        }
      } else {
        // Calculate later.
        this.dependenciesToCalc[dependency.fieldUid] = dependency;
      }
    }
  }

  private async rowDependenciesEvalAsync(
    tableSettings: MetaObjectTable,
    columnSettings: MetaObjectTableColumn,
    row: any,
    evaluator: ExpressionEvaluator,
  ):Promise<void> {
    if (!columnSettings.dependencies) {
      return;
    }

    if (!columnSettings.dependencies.length) {
      return;
    }

    for (const dependency of columnSettings.dependencies) {
      if (dependency.kind === DependencyKinds.RowField) {
        // Calculate dependent fields.
        const dependentColumn = tableSettings.columns.find((x) => x.uid === dependency.fieldUid);
        if (!dependentColumn) {
          this.logger.logError(`Cannot find table column by uid: ${dependency.fieldUid}`);
        } else {
          row[dependentColumn.name] = await evaluator.evaluateExpressionAsync(
            dependentColumn.formula,
          );

          await this.rowDependenciesEvalAsync(tableSettings, dependentColumn, row, evaluator);
        }
      } else {
        // Calculate later.
        this.dependenciesToCalc[dependency.fieldUid] = dependency;
      }
    }
  }

  private async existingDependenciesEvalAsync(evaluator: ExpressionEvaluator): Promise<void> {
    this.logger.logDebug('DependenciesEval.Start');
    let dependencies = [];

    // eslint-disable-next-line no-restricted-syntax,guard-for-in
    for (const key in this.dependenciesToCalc) {
      dependencies.push(this.dependenciesToCalc[key]);
    }
    this.dependenciesToCalc = {};

    let flagContinue = dependencies.length > 0;
    let i = 0;

    while (flagContinue) {
      i += 1;
      this.logger.logDebug(`DependenciesEval.Iteration ${i}`);

      // Header dependencies.
      for (const dependency of dependencies.filter((x) => x.kind === DependencyKinds.HeaderField)) {
        const dependentColumn = this.settings.header.columns.find(
          (x) => x.uid === dependency.fieldUid,
        );

        if (!dependentColumn) {
          this.logger.logError(`Cannot find header column by uid: ${dependency.fieldUid}`);
        } else {
          const calcResult = await evaluator.evaluateExpressionAsync(dependentColumn.formula);
          this.dataObject.header[dependentColumn.name] = calcResult;

          await this.headerDependenciesEvalAsync(dependentColumn, evaluator);
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

        await this.tableRecalculateAsync(tableSettings, column, evaluator);
      }

      dependencies = [];
      // eslint-disable-next-line no-restricted-syntax,guard-for-in
      for (const key in this.dependenciesToCalc) {
        dependencies.push(this.dependenciesToCalc[key]);
      }
      flagContinue = dependencies.length > 0 && i <= ObjectEvaluator.MAX_ITERATIONS;
    }
  }

  private async tableRecalculateAsync(
    tableSettings: MetaObjectTable,
    column: MetaObjectTableColumn,
    evaluator: ExpressionEvaluator,
  ): Promise<void> {
    const table = this.dataObject.detailsTables.find(
      (x) => x.uid === tableSettings.uid,
    );

    if (!table) {
      this.logger.logError(`Cannot find table by uid: ${tableSettings.uid}`);
      return;
    }

    for (const row of table.rows) {
      this.dataObject.currentRow = row;
      row[column.name] = await evaluator.evaluateExpressionAsync(column.formula);
      await this.rowDependenciesEvalAsync(tableSettings, column, row, evaluator);
    }
  }
}
