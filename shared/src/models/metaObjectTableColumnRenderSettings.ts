export default class MetaObjectTableColumnRenderSettings {
  uid: string;
  controlKindUid: string;

  constructor(params: any = {}) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || '';
    this.controlKindUid = data.controlKindUid || '';
  }
}
