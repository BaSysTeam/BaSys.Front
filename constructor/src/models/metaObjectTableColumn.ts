export default class MetaObjectTableColumn {
  uid:string;
  title:string;
  name:string;
  dataTypeUid:string;
  stringLength:string;
  numberDigits:number;
  primaryKey:boolean;
  required:boolean;
  unique:boolean;

  constructor(data: any) {
    this.uid = data.uid || '';
    this.title = data.title || '';
    this.name = data.name || '';
    this.dataTypeUid = data.dataTypeUid || '';
    this.stringLength = data.stringLength || 100;
    this.numberDigits = data.numberDigits || 2;
    this.primaryKey = data.primaryKey || false;
    this.required = data.required || false;
    this.unique = data.isUnique || false;
  }
}
