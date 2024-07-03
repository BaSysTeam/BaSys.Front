import { DbType } from '../enums/DbTypes';

export default class DataType {
  uid!: string;
  title!: string;
  isPrimitive!: boolean;
  dbType!: DbType;
  objectKindUid!: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || '';
    this.title = data.title || '';
    this.dbType = data.dbType || DbType.String;
    this.isPrimitive = data.isPrimitive || false;
    this.objectKindUid = data.objectKindUid || '';
  }
}
