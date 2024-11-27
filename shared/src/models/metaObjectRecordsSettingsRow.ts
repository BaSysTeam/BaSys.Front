import { Guid } from 'guid-typescript';
import MetaObjectRecordsSettingsColumn from './metaObjectRecordsSettingsColumn';

export default class MetaObjectRecordsSettingsRow {
  uid: string;
  sourceUid: string;
  direction: number;
  columns: MetaObjectRecordsSettingsColumn[];

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || '';
    this.sourceUid = data.sourceUid || Guid.create().toString();
    this.direction = data.direction || 0;

    this.columns = [];
    if (data.columns) {
      data.columns.forEach((column: any) => {
        this.columns.push(new MetaObjectRecordsSettingsColumn(column));
      });
    }
  }

  setValue(key: string, value: any):void {
    if (key === 'direction') {
      this.direction = value;
    } else if (key === 'sourceUid') {
      this.sourceUid = key;
    } else {
      const column = this.columns.find(
        (column) => column.destinationColumnUid === key,
      );
      if (column) {
        column.expression = value;
      }
    }
  }
}
