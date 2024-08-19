export default class MetaObjectTableColumnRenderSettings {
  controlKindUid: string;

  constructor(params: any = {}) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.controlKindUid = data.controlKindUid || '';
  }
}
