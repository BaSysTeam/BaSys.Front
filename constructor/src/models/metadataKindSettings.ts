import { Guid } from 'guid-typescript';
import MetadataKindStandardColumn from './metadataKindStandardColumn';

export default class MetadataKindSettings {
    uid: string;
    name: string;
    namePlural:string;
    title: string;
    prefix:string;
    storeData:boolean;
    isReference:boolean;
    isStandard:boolean;
    memo:string;
    version:number;
    standardColumns: MetadataKindStandardColumn[];

    constructor(params: any = {}) {
      let initialData: any = {};
      if (params != null) {
        initialData = params;
      }
      this.uid = initialData.uid || Guid.EMPTY;
      this.namePlural = initialData.namePlural || '';
      this.name = initialData.name || '';
      this.title = initialData.title || '';
      this.prefix = initialData.prefix || '';
      this.storeData = initialData.storeData || false;
      this.isReference = initialData.isReference || false;
      this.isStandard = initialData.isStandard || false;
      this.memo = initialData.memo || '';
      this.version = initialData.version || 0;

      this.standardColumns = initialData.standardColumns
        ? initialData.standardColumns.map((item: any) => new MetadataKindStandardColumn(item)) : [];
    }

    isNew():boolean {
      return this.stringIsNullOrEmpty(this.uid) || this.uid === Guid.EMPTY;
    }

    stringIsNullOrEmpty(value: string | null | undefined): boolean {
      return value === null || value === undefined || value === '';
    }

    onNameChanged(): void {
      if (!this.namePlural && !this.name) {
        this.namePlural = `${this.name}s`;
      }
    }
}
