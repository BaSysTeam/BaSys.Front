export default class MetaObjectCreateDto {
  parentUid?:string;
  metadataKindUid:string;
  name:string;
  title:string;
  memo:string;

  constructor(params: any) {
    let initialData: any = {};
    if (params != null) {
      initialData = params;
    }

    this.parentUid = initialData.parentUid || '';
    this.metadataKindUid = initialData.metadataKindUid || '';
    this.title = initialData.title || '';
    this.name = initialData.name || '';
    this.memo = initialData.memo || '';
  }
}
