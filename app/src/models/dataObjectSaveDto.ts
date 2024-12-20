import DataObject from '@/models/dataObject';

export default class DataObjectSaveDto {
  metaObjectKindUid: string;
  metaObjectUid: string;
  item: DataObject;
  logLevel: number;

  constructor(
    metaObjectKindUid: string,
    metaObjectUid: string,
    item: DataObject,
    logLevel: number,
  ) {
    this.metaObjectKindUid = metaObjectKindUid;
    this.metaObjectUid = metaObjectUid;
    this.item = item;
    this.logLevel = logLevel;
  }
}
