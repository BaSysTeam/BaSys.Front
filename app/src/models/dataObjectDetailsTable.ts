import { Guid } from 'guid-typescript';
import MetaObjectTable from '../../../shared/src/models/metaObjectTable';
import DataType from '../../../shared/src/models/dataType';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';

export default class DataObjectDetailsTable {
  name: string;
  title: string;
  uid: string;
  isModified: boolean;
  rows: any[];

  constructor(params: any) {
    let data: any = {};
    if (params) {
      data = params;
    }

    this.name = data.name || '';
    this.title = data.title || '';
    this.uid = data.uid || '';
    this.isModified = data.isModified || false;
    this.rows = [];
    if (data.rows) {
      data.rows.forEach((row: any) => {
        this.rows.push(row);
      });
    }
  }

  get display(): string {
    return `${this.title} (${this.rows.length})`;
  }

  sum(columnName: string): number {
    let result = 0;
    this.rows.forEach((row: any) => {
      result += row[columnName];
    });
    return result;
  }

  newRow(
    tableSettings: MetaObjectTable,
    dataTypes: DataType[],
    objectUid: string,
    currentIndex: number,
  ): any {
    const newRow: any = {};
    tableSettings.columns.forEach((column) => {
      const dataType = dataTypes.find((x) => x.uid === column.dataTypeUid);
      if (dataType) {
        let currentValue: any = '';
        if (dataType.uid === DataTypeDefaults.Int.uid
          || dataType.uid === DataTypeDefaults.Long.uid
          || dataType.uid === DataTypeDefaults.Decimal.uid) {
          currentValue = 0;
        } else if (dataType.uid === DataTypeDefaults.Bool.uid) {
          currentValue = false;
        }
        newRow[column.name] = currentValue;
        if (!dataType.isPrimitive) {
          newRow[`${column.name}_display`] = '';
        }
      } else {
        newRow[column.name] = '';
      }
    });
    newRow.object_uid = objectUid;
    newRow.row_number = this.rows.length + 1;
    newRow.id = Guid.create();

    if (currentIndex > -1) {
      this.rows.splice(currentIndex + 1, 0, newRow);
    } else {
      this.rows.push(newRow);
    }

    return newRow;
  }
}
