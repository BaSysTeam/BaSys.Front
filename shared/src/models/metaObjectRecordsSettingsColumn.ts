export default class MetaObjectRecordsSettingsColumn {
  destinationColumnUid: string;
  name: string;
  expression: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.destinationColumnUid = data.destinationColumnUid || '';
    this.name = data.name || '';
    this.expression = data.expression || '';
  }
}
