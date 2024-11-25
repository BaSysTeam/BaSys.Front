export default class MetaObjectRecordsSettingsColumn {
  destinationColumnUid: string;
  expression: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.destinationColumnUid = data.destinationColumnUid || '';
    this.expression = data.expression || '';
  }
}
