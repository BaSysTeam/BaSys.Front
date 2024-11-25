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
    this.sourceUid = data.sourceUid || '';
    this.direction = data.direction || 0;

    this.columns = [];
    if (data.columns) {
      data.columns.forEach((column: any) => {
        this.columns.push(new MetaObjectRecordsSettingsColumn(column));
      });
    }
  }
}
