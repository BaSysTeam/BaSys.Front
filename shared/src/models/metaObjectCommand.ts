import { Guid } from 'guid-typescript';

export default class MetaObjectCommand {
  uid: string;
  tableUid: string;
  title: string;
  name: string;
  expression: string;
  memo: string;
  isActive:boolean;

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.name = data.name || '';
    this.tableUid = data.tableUid;
    this.expression = data.expression || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || true;
  }
}
