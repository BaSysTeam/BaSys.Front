import MetaObjectTableColumn from './metaObjectTableColumn';

export default class MetaObjectTable {
  uid:string;
  title:string;
  name:string;
  memo:string;
  isHeader:boolean;
  columns:Array<MetaObjectTableColumn>;

  constructor(data: any) {
    this.uid = data.uid || '';
    this.title = data.title || '';
    this.name = data.name || '';
    this.memo = data.memo || '';
    this.isHeader = data.isHeader || false;

    this.columns = data.columns
      ? data.columns.map((item: any) => new MetaObjectTableColumn(item)) : [];
  }
}
