import MetaObjectRecordsSettingsRow from './metaObjectRecordsSettingsRow';

export default class MetaObjectRecordsSettingsItem {
  destinationMetaObjectUid: string;
  rows: MetaObjectRecordsSettingsRow[];
  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.destinationMetaObjectUid = data.destinationMetaObjectUid || '';
    this.rows = [];
    if (data.rows) {
      data.rows.forEach((row: any) => {
        this.rows.push(new MetaObjectRecordsSettingsRow(row));
      });
    }
  }
}
