import { Guid } from 'guid-typescript';
import MetaObjectTableColumnDataSettings from './metaObjectTableColumnDataSettings';

export default class MetaObjectKindStandardColumn {
    uid: string;
    name:string;
    title: string;
    dataSettings: MetaObjectTableColumnDataSettings;
    // dataTypeUid:string;
    // stringLength:number;
    // numberDigits:number;
    // isPrimaryKey:boolean;
    // isRequired:boolean;
    // isUnique:boolean;
    memo:string;

    constructor(params: any = {}) {
      let initialData: any = {};
      if (params != null) {
        initialData = params;
      }
      this.uid = initialData.uid || Guid.create().toString();
      this.name = initialData.name || '';
      this.title = initialData.title || '';
      this.dataSettings = new MetaObjectTableColumnDataSettings(initialData.dataSettings);

      this.memo = initialData.memo || '';
    }
}
