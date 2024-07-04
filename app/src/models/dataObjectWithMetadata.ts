import { Guid } from 'guid-typescript';
import DataObject from '@/models/dataObject';
import DataType from '../../../shared/src/models/dataType';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';

export default class DataObjectWithMetadata {
  item: DataObject;
  metaObjectKindSettings: MetaObjectKindSettings;
  metaObjectSettings: MetaObjectStorableSettings;
  dataTypes: DataType[];
  isNew = false;
  isPrimaryKeyEditable = false;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.metaObjectKindSettings = new MetaObjectKindSettings(data.metaObjectKindSettings);
    this.metaObjectSettings = new MetaObjectStorableSettings(data.metaObjectSettings);
    this.item = new DataObject(data.item);

    // Convert ISO string to Date.
    this.metaObjectSettings.header.columns.forEach((column: MetaObjectTableColumn) => {
      if (column.dataTypeUid === DataTypeDefaults.DateTime.uid) {
        console.log('date value before', this.item.header[column.name]);
        const isoString = this.item.header[column.name];
        if (isoString === '0001-01-01T00:00:00' || !isoString) {
          this.item.header[column.name] = '';
        } else {
          this.item.header[column.name] = new Date(this.item.header[column.name]);
        }
      }
    });

    this.dataTypes = [];
    if (data.dataTypes) {
      data.dataTypes.forEach((item: any) => {
        this.dataTypes.push(new DataType(item));
      });
    }

    this.isNew = this.checkIsNew();
    this.isPrimaryKeyEditable = this.checkIsPrimaryKeyEditable();
  }

  checkIsNew(): boolean {
    const primaryKey = this.metaObjectSettings.header.getPrimaryKey();
    if (primaryKey == null) {
      return true;
    }

    const pkValue = this.item.header[primaryKey.name];

    if (!pkValue) {
      return true;
    }

    if (pkValue === Guid.EMPTY) {
      return true;
    }

    return false;
  }

  checkIsPrimaryKeyEditable(): boolean {
    const primaryKey = this.metaObjectSettings.header.getPrimaryKey();
    if (primaryKey == null) {
      return false;
    }

    if (primaryKey.dataTypeUid === '0234c067-7868-46b2-ba8e-e22fae5255cb') {
      return true;
    }

    return false;
  }

  setPrimaryKey(key: string): void {
    const primaryKey = this.metaObjectSettings.header.getPrimaryKey();
    if (primaryKey == null) {
      return;
    }

    this.item.header[primaryKey.name] = key;
    this.isNew = this.checkIsNew();
  }

  getUid(): string {
    const primaryKey = this.metaObjectSettings.header.getPrimaryKey();
    if (primaryKey == null) {
      return '';
    }

    return this.item.header[primaryKey.name];
  }

  addCopyMessage(fieldName: string): void {
    if (this.item.header[fieldName]) {
      this.item.header[fieldName] = `Copy ${this.item.header[fieldName]}`;
    }
  }
}
