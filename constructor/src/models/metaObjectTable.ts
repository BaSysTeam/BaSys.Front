import MetaObjectTableColumn from './metaObjectTableColumn';

export default class MetaObjectTable {
  uid:string;
  title:string;
  name:string;
  memo:string;
  columns:Array<MetaObjectTableColumn>;

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || '';
    this.title = data.title || '';
    this.name = data.name || '';
    this.memo = data.memo || '';

    this.columns = data.columns
      ? data.columns.map((item: any) => new MetaObjectTableColumn(item)) : [];
  }
}
