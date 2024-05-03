export default class MetaObjectCreateDto {
  parentUid?:string;
  metaObjectKindUid:string;
  name:string;
  title:string;
  memo:string;

  constructor(params: any) {
    let initialData: any = {};
    if (params != null) {
      initialData = params;
    }

    this.parentUid = initialData.parentUid || '';
    this.metaObjectKindUid = initialData.metaObjectKindUid || '';
    this.title = initialData.title || '';
    this.name = initialData.name || '';
    this.memo = initialData.memo || '';
  }
}
