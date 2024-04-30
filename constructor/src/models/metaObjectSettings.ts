export default class MetaObjectSettings {
  uid!:string;
  metaObjectKindUid!:string;
  title!:string;
  name!:string;
  memo!:string;
  isActive!:boolean;

  constructor(data: any) {
    this.uid = data.uid || '';
    this.metaObjectKindUid = data.metaObjectKindUid || '';
    this.title = data.title || '';
    this.name = data.name || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || false;
  }
}
