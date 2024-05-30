import { Guid } from 'guid-typescript';
import MetaObjectKindStandardColumn from './metaObjectKindStandardColumn';

export default class MetaObjectKindSettings {
    uid: string;
    name: string;
    title: string;
    prefix:string;
    storeData:boolean;
    isReference:boolean;
    allowAttachedFiles:boolean;
    isStandard:boolean;
    memo:string;
    version:number;
    iconClass:string;
    standardColumns: MetaObjectKindStandardColumn[];
    availableRoles: Array<string>;

    constructor(params: any = {}) {
      let initialData: any = {};
      if (params != null) {
        initialData = params;
      }
      this.uid = initialData.uid || Guid.EMPTY;
      this.name = initialData.name || '';
      this.title = initialData.title || '';
      this.prefix = initialData.prefix || '';
      this.storeData = initialData.storeData || false;
      this.isReference = initialData.isReference || false;
      this.allowAttachedFiles = initialData.allowAttachedFiles || false;
      this.isStandard = initialData.isStandard || false;
      this.memo = initialData.memo || '';
      this.version = initialData.version || 0;
      this.iconClass = initialData.iconClass || '';

      this.standardColumns = initialData.standardColumns
        ? initialData.standardColumns.map(
          (item: any) => new MetaObjectKindStandardColumn(item),
        ) : [];

      this.availableRoles = initialData.availableRoles || [];
    }

    isNew():boolean {
      return this.stringIsNullOrEmpty(this.uid) || this.uid === Guid.EMPTY;
    }

    stringIsNullOrEmpty(value: string | null | undefined): boolean {
      return value === null || value === undefined || value === '';
    }

    newStandardColumn(): void {
      this.standardColumns.push(new MetaObjectKindStandardColumn({}));
    }
}
