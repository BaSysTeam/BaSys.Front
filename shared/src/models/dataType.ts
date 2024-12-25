import { DbType } from '../enums/dbTypes';

export default class DataType {
  uid: string;
  kind: string;
  name: string;
  title: string;
  isPrimitive: boolean;
  dbType: DbType;
  objectKindUid: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || '';
    this.kind = data.kind || '';
    this.name = data.name || '';
    this.title = data.title || '';
    this.dbType = data.dbType || DbType.String;
    this.isPrimitive = data.isPrimitive || false;
    this.objectKindUid = data.objectKindUid || '';
  }
}
