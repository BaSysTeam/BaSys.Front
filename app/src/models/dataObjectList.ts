import DataObject from './dataObject';
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';

export default class DataObjectList {
  metaObjectKindSettings: MetaObjectKindSettings;
  metaObjectSettings: MetaObjectStorableSettings;
  items: DataObject[];

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.metaObjectKindSettings = new MetaObjectKindSettings(data.metaObjectKindSettings);
    this.metaObjectSettings = new MetaObjectStorableSettings(data.metaObjectSettings);
    this.items = data.items || [];
  }
}
