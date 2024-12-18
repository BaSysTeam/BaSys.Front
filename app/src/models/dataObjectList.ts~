import DataObject from './dataObject';
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import DataType from '../../../shared/src/models/dataType';

export default class DataObjectList {
  metaObjectKindSettings: MetaObjectKindSettings;
  metaObjectSettings: MetaObjectStorableSettings;
  items: DataObject[];
  dataTypes: DataType[];

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.metaObjectKindSettings = new MetaObjectKindSettings(data.metaObjectKindSettings);
    this.metaObjectSettings = new MetaObjectStorableSettings(data.metaObjectSettings);
    this.items = data.items || [];

    this.dataTypes = [];
    if (data.dataTypes) {
      data.dataTypes.forEach((item: any) => {
        this.dataTypes.push(new DataType(item));
      });
    }
  }
}
