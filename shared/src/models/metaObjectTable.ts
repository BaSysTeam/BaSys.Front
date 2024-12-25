import MetaObjectTableColumn from './metaObjectTableColumn';

export default class MetaObjectTable {
  uid:string;
  title:string;
  name:string;
  memo:string;
  isModified:boolean;
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
    this.isModified = data.isModified || false;

    this.columns = data.columns
      ? data.columns.map((item: any) => new MetaObjectTableColumn(item)) : [];
  }

  getPrimaryKey(): MetaObjectTableColumn | null {
    const filterResult = this.columns.filter((x) => x.dataSettings.primaryKey);
    if (filterResult.length) {
      return filterResult[0];
    }

    return null;
  }

  getColumn(uid: string): MetaObjectTableColumn | undefined {
    return this.columns.find((x) => x.uid === uid);
  }

  getColumnByName(name: string): MetaObjectTableColumn | undefined {
    return this.columns.find((x) => x.name === name);
  }

  getColumnByDataType(dataTypeUid: string): MetaObjectTableColumn | undefined {
    return this.columns.find((x) => x.dataSettings.dataTypeUid === dataTypeUid);
  }

  newColumn(params: any): MetaObjectTableColumn {
    const column = new MetaObjectTableColumn(params);
    this.columns.push(column);
    return column;
  }
}
