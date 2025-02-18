import { Guid } from 'guid-typescript';
import MetaObjectCommandParameter from './metaObjectCommandParameter';
import { DbType } from '../enums/dbTypes';
import MetaObjectTableColumn from './metaObjectTableColumn';
import DataTypeDefaults from '../dataProviders/dataTypeDefaults';
import MetaObjectTable from './metaObjectTable';
import MetaObjectCommand from './metaObjectCommand';
import MetaObjectRecordsSettingsItem from './metaObjectRecordsSettingsItem';
import { MetaObjectCommandParameterNames as ParamNames } from './metaObjectCommandParameterNames';

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
  detailTables: MetaObjectTable[];
  commands:MetaObjectCommand[];
  recordsSettings:MetaObjectRecordsSettingsItem[];

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

    this.commands = [];
    if (data.commands) {
      data.commands.forEach((item: any) => this.commands.push(new MetaObjectCommand(item)));
    }

    this.recordsSettings = [];
    if (data.recordsSettings) {
      data.recordsSettings.forEach(
        (item: any) => this.recordsSettings.push(new MetaObjectRecordsSettingsItem(item)),
      );
    }
  }

  get isNew():boolean {
    return !this.uid;
  }

  get allTables(): MetaObjectTable[] {
    const collection = [];

    collection.push(this.header);
    this.detailTables.forEach((table) => { collection.push(table); });

    return collection;
  }

  newDetailTable(objectPrimaryKeyDataTypeUid: string): MetaObjectTable {
    const detailTable = new MetaObjectTable({
      uid: Guid.create().toString(),
    });

    // Primary key column.
    const pkColumn = new MetaObjectTableColumn(null);
    pkColumn.uid = Guid.create().toString();
    pkColumn.name = 'id';
    pkColumn.title = 'Id';
    pkColumn.dataSettings.dataTypeUid = DataTypeDefaults.Long.uid;
    pkColumn.dataSettings.primaryKey = true;
    pkColumn.isStandard = true;

    detailTable.columns.push(pkColumn);

    // Object uid column.
    const objectUidColumn = new MetaObjectTableColumn(null);
    objectUidColumn.uid = Guid.create().toString();
    objectUidColumn.name = 'object_uid';
    objectUidColumn.title = 'Object UID';
    objectUidColumn.dataSettings.dataTypeUid = objectPrimaryKeyDataTypeUid;
    objectUidColumn.dataSettings.required = true;
    objectUidColumn.isStandard = true;

    detailTable.columns.push(objectUidColumn);

    // Row number column.
    const rowNumberColumn = new MetaObjectTableColumn(null);
    rowNumberColumn.uid = Guid.create().toString();
    rowNumberColumn.name = 'row_number';
    rowNumberColumn.title = 'Row number';
    rowNumberColumn.dataSettings.dataTypeUid = DataTypeDefaults.Int.uid;
    rowNumberColumn.dataSettings.required = true;
    rowNumberColumn.isStandard = true;

    detailTable.columns.push(rowNumberColumn);

    this.detailTables.push(detailTable);

    return detailTable;
  }

  getTable(uid: string): MetaObjectTable | undefined {
    return this.allTables.find((x) => x.uid === uid);
  }

  getTableByName(name: string): MetaObjectTable | undefined {
    return this.allTables.find((x) => x.name === name);
  }

  deleteDetailsTable(uid: string): void {
    const table = this.detailTables.find((x) => x.uid === uid);
    if (!table) {
      return;
    }
    const ind = this.detailTables.indexOf(table);
    if (ind > -1) {
      this.detailTables.splice(ind, 1);
    }
  }

  copyDetailsTable(uid: string): MetaObjectTable {
    const table = this.detailTables.find((x) => x.uid === uid);
    if (!table) {
      return new MetaObjectTable(null);
    }
    const newTable = new MetaObjectTable(table);
    newTable.title = `${newTable.title} - copy`;
    newTable.name = '';
    newTable.uid = Guid.create().toString();

    this.detailTables.push(newTable);

    return newTable;
  }

  newCommand(kind: number): MetaObjectCommand {
    const data: any = { kind, parameters: [] };
    const dsParameter = new MetaObjectCommandParameter({ name: ParamNames.DATA_SOURCE, value: '' });
    const clearParameter = new MetaObjectCommandParameter(
      { name: ParamNames.CLEAR, value: 'false', dbType: DbType.Boolean },
    );
    switch (kind) {
      case 1:
        data.parameters.push(dsParameter);
        data.parameters.push(clearParameter);
        break;
      case 2:
        data.parameters.push(dsParameter);
        break;
      default:
        break;
    }

    const command = new MetaObjectCommand(data);
    this.commands.push(command);

    return command;
  }

  deleteCommand(command: MetaObjectCommand): void {
    const ind = this.commands.indexOf(command);
    if (ind > -1) {
      this.commands.splice(ind, 1);
    }
  }
}
