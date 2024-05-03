import { Guid } from 'guid-typescript';

export default class MetaObjectKindStandardColumn {
    uid: string;
    name:string;
    title: string;
    dataTypeUid:string;
    stringLength:number;
    numberDigits:number;
    isPrimaryKey:boolean;
    isRequired:boolean;
    isUnique:boolean;
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
      this.stringLength = initialData.stringLength || 100;
      this.numberDigits = initialData.numberDigits || 2;
      this.isPrimaryKey = initialData.isPrimaryKey || false;
      this.isRequired = initialData.isRequired || false;
      this.isUnique = initialData.isUnique || false;
      this.memo = initialData.memo || '';
    }
}
