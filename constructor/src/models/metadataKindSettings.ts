import MetadataKindStandardColumn from './metadataKindStandardColumn';

export default class MetadataKindSettings {
    uid: string;
    name:string;
    title: string;
    prefix:string;
    storeData:boolean;
    isReference:boolean;
    isStandard:boolean;
    memo:string;
    standardColumns: MetadataKindStandardColumn[];

    constructor(params: any = {}) {
      let initialData: any = {};
      if (params != null) {
        initialData = params;
      }
      this.uid = initialData.uid || '';
      this.name = initialData.name || '';
      this.title = initialData.title || '';
      this.prefix = initialData.prefix || '';
      this.storeData = initialData.storeData || false;
      this.isReference = initialData.isReference || false;
      this.isStandard = initialData.isStandard || false;
      this.memo = initialData.memo || '';

      this.standardColumns = initialData.standardColumns
        ? initialData.standardColumns.map((item: any) => new MetadataKindStandardColumn(item)) : [];
    }
}
