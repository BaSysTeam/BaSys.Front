import { Guid } from 'guid-typescript';
import MetaObjectKindStandardColumn from './metaObjectKindStandardColumn';
import MetaObjectKindRecordsSettings from './metaObjectKindRecordsSettings';

export default class MetaObjectKindSettings {
    uid: string;
    name: string;
    title: string;
    prefix:string;
    storeData:boolean;
    isReference:boolean;
    allowAttachedFiles:boolean;
    canCreateRecords: boolean;
    useDetailsTables: boolean;
    isStandard:boolean;
    memo:string;
    version:number;
    iconClass:string;
    orderByExpression: string;
    displayExpression: string;
    recordsSettings: MetaObjectKindRecordsSettings | null;
    standardColumns: MetaObjectKindStandardColumn[];
    availableRights: Array<string>;

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
      this.canCreateRecords = initialData.canCreateRecords || false;
      this.useDetailsTables = initialData.useDetailsTables || false;
      this.isStandard = initialData.isStandard || false;
      this.memo = initialData.memo || '';
      this.version = initialData.version || 0;
      this.iconClass = initialData.iconClass || '';
      this.orderByExpression = initialData.orderByExpression || '';
      this.displayExpression = initialData.displayExpression || '';

      if (this.canCreateRecords) {
        this.recordsSettings = new MetaObjectKindRecordsSettings(initialData.recordsSettings);
      } else {
        this.recordsSettings = null;
      }

      this.standardColumns = initialData.standardColumns
        ? initialData.standardColumns.map(
          (item: any) => new MetaObjectKindStandardColumn(item),
        ) : [];

      this.availableRights = initialData.availableRights || [];
    }

    isNew():boolean {
      return this.stringIsNullOrEmpty(this.uid) || this.uid === Guid.EMPTY;
    }

    stringIsNullOrEmpty(value: string | null | undefined): boolean {
      return value === null || value === undefined || value === '';
    }

    newStandardColumn(params: any): MetaObjectKindStandardColumn {
      const newColumn = new MetaObjectKindStandardColumn(params);
      this.standardColumns.push(newColumn);

      return newColumn;
    }
}
