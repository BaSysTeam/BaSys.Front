import { Guid } from 'guid-typescript';
import MetaObjectTableColumn from './metaObjectTableColumn';
import DataTypeDefaults from '../dataProviders/dataTypeDefaults';
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
  detailTables: Array<MetaObjectTable>

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

    this.detailTables = data.detailTables
      ? data.detailTables.map((item: any) => new MetaObjectTable(item)) : [];
  }

  newDetailTable(objectPrimaryKeyDataTypeUid: string): MetaObjectTable {
    const detailTable = new MetaObjectTable({
      uid: Guid.create().toString(),
    });

    // Primary key column.
    const pkColumn = new MetaObjectTableColumn(null);
    pkColumn.uid = Guid.create().toString();
    pkColumn.name = 'uid';
    pkColumn.title = 'Uid';
    pkColumn.dataTypeUid = DataTypeDefaults.UniqueIdentifier.uid;
    pkColumn.primaryKey = true;
    pkColumn.isStandard = true;

    detailTable.columns.push(pkColumn);

    // Object uid column.
    const objectUidColumn = new MetaObjectTableColumn(null);
    objectUidColumn.uid = Guid.create().toString();
    objectUidColumn.name = 'object_uid';
    objectUidColumn.title = 'Object UID';
    objectUidColumn.dataTypeUid = objectPrimaryKeyDataTypeUid;
    objectUidColumn.required = true;
    objectUidColumn.isStandard = true;

    detailTable.columns.push(objectUidColumn);

    // Row number column.
    const rowNumberColumn = new MetaObjectTableColumn(null);
    rowNumberColumn.uid = Guid.create().toString();
    rowNumberColumn.name = 'row_number';
    rowNumberColumn.title = 'Row number';
    rowNumberColumn.dataTypeUid = DataTypeDefaults.Int.uid;
    pkColumn.required = true;
    pkColumn.isStandard = true;

    detailTable.columns.push(rowNumberColumn);

    this.detailTables.push(detailTable);

    return detailTable;
  }
}
