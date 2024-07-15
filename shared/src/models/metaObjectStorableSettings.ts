import MetaObjectTable from './metaObjectTable';

export default class MetaObjectStorableSettings {
  uid:string;
  metaObjectKindUid:string;
  editMethod:number;
  title:string;
  name:string;
  memo:string;
  orderByExpression: string;
  displayExpression: string;
  isActive:boolean;
  header: MetaObjectTable;
  tableParts: Array<MetaObjectTable>

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || '';
    this.metaObjectKindUid = data.metaObjectKindUid || '';
    this.editMethod = data.editMethod || 0;
    this.title = data.title || '';
    this.name = data.name || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || false;
    this.header = new MetaObjectTable(data.header);
    this.orderByExpression = data.orderByExpression || '';
    this.displayExpression = data.displayExpression || '';

    this.tableParts = data.tableParts
      ? data.tableParts.map((item: any) => new MetaObjectTable(item)) : [];
  }
}
