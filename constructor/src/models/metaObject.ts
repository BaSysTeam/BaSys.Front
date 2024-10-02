export default class MetaObject {
  metaObjectKindUid:string;
  uid:string;
  name:string;
  title:string;
  memo:string;
  isActive: boolean;

  constructor(params:any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }
    this.metaObjectKindUid = data.metaObjectKindUid || '';
    this.uid = data.uid || '';
    this.title = data.title || '';
    this.name = data.name || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || false;
  }
}
