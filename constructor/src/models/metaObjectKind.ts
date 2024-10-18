export default class MetaObjectKind {
    uid: string;
    name:string;
    title: string;
    prefix:string;
    storeData:boolean;
    isReference:boolean;
    isStandard:boolean;
    memo:string;
    version:number;

    constructor(params:any) {
      let data: any = {};
      if (params != null) {
        data = params;
      }

      this.uid = data.uid || '';
      this.name = data.name || '';
      this.title = data.title || '';
      this.prefix = data.prefix || '';
      this.storeData = data.storeData || false;
      this.isReference = data.isReference || false;
      this.isStandard = data.isStandard || false;
      this.isReference = data.isReference || false;
      this.memo = data.memo || '';
      this.version = data.version || 0;
    }
}
