import { Guid } from 'guid-typescript';

export default class MetaObjectKindStandardColumn {
    uid: string;
    name:string;
    title: string;
    dataTypeUid:string;
    isPrimaryKey:boolean;
    memo:string;

    constructor(params: any = {}) {
      let initialData: any = {};
      if (params != null) {
        initialData = params;
      }
      this.uid = initialData.uid || Guid.create().toString();
      this.name = initialData.name || '';
      this.title = initialData.title || '';
      this.dataTypeUid = initialData.dataTypeUid || '';
      this.isPrimaryKey = initialData.isPrimaryKey || false;
      this.memo = initialData.memo || '';
    }
}
