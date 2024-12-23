export default class MetaObjectTableColumnDataSettings {
  dataTypeUid:string;
  stringLength:number;
  numberDigits:number;
  primaryKey:boolean;
  required:boolean;
  unique:boolean;
  defaultValue: string;
  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.dataTypeUid = data.dataTypeUid || '';
    this.stringLength = data.stringLength || 100;
    this.numberDigits = data.numberDigits || 2;
    this.primaryKey = data.primaryKey || false;
    this.required = data.required || false;
    this.unique = data.unique || false;
    this.defaultValue = data.defaultValue || null;
  }
}
