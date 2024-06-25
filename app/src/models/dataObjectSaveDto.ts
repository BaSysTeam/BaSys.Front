import DataObject from '@/models/dataObject';

export default class DataObjectSaveDto {
  metaObjectKindUid: string;
  metaObjectUid: string;
  item: DataObject;

  constructor(metaObjectKindUid: string, metaObjectUid: string, item: DataObject) {
    this.metaObjectKindUid = metaObjectKindUid;
    this.metaObjectUid = metaObjectUid;
    this.item = item;
  }
}
