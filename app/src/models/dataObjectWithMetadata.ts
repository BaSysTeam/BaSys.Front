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
}
