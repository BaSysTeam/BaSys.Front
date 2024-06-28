import { Guid } from 'guid-typescript';
import DataObject from '@/models/dataObject';
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';

export default class DataObjectWithMetadata {
  item: DataObject;
  metaObjectKindSettings: MetaObjectKindSettings;
  metaObjectSettings: MetaObjectStorableSettings;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.metaObjectKindSettings = new MetaObjectKindSettings(data.metaObjectKindSettings);
    this.metaObjectSettings = new MetaObjectStorableSettings(data.metaObjectSettings);
    this.item = new DataObject(data.item);
  }

  isNew(): boolean {
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

  isPrimaryKeyEditable(): boolean {
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
  }

  addCopyMessage(fieldName: string): void {
    if (this.item.header[fieldName]) {
      this.item.header[fieldName] = `Copy ${this.item.header[fieldName]}`;
    }
  }
}
