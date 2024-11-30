export default class MetaObjectKindRecordsSettings {
  sourceCreateRecordsColumnUid: string;
  storageMetaObjectKindUid: string;
  storagePeriodColumnUid: string;
  storageKindColumnUid: string;
  storageMetaObjectColumnUid: string;
  storageObjectColumnUid: string;
  storageRowColumnUid: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.sourceCreateRecordsColumnUid = data.sourceCreateRecordsColumnUid || '';
    this.storageMetaObjectKindUid = data.storageMetaObjectKindUid || '';
    this.storagePeriodColumnUid = data.storagePeriodColumnUid || '';
    this.storageKindColumnUid = data.storageKindColumnUid || '';
    this.storageMetaObjectColumnUid = data.storageMetaObjectColumnUid || '';
    this.storageObjectColumnUid = data.storageObjectColumnUid || '';
    this.storageRowColumnUid = data.storageRowColumnUid || '';
  }
}
