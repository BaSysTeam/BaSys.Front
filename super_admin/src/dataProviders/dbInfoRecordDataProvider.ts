import DbInfoRecord from '@/models/dbInfoRecord';
import { DbKinds } from '@/enums/dbKinds';

export default class DbInfoRecordService {
    private dbInfoRecords: DbInfoRecord[] = [
      new DbInfoRecord({
        id: 1,
        appId: 'appId_1',
        title: 'title_1',
        dbKind: DbKinds.Postgres,
        connectionString: 'connectionString_1',
        memo: 'memo_1',
        isDeleted: false,
      }),
      new DbInfoRecord({
        id: 2,
        appId: 'appId_2',
        title: 'title_2',
        dbKind: DbKinds.Postgres,
        connectionString: 'connectionString_2',
        memo: 'memo_2',
        isDeleted: false,
      }),
      new DbInfoRecord({
        id: 3,
        appId: 'appId_3',
        title: 'title_3',
        dbKind: DbKinds.SqlServer,
        connectionString: 'connectionString_3',
        memo: 'memo_3',
        isDeleted: false,
      }),
    ];

    getDbInfoRecords() {
      return Promise.resolve(this.dbInfoRecords);
    }

    addDbInfoRecord(param: DbInfoRecord) {
      const newItem = param;
      newItem.id = this.dbInfoRecords[this.dbInfoRecords.length - 1].id + 1;
      this.dbInfoRecords.push(param);

      return Promise.resolve(true);
    }

    deleteDbInfoRecord(param: DbInfoRecord) {
      const item = this.dbInfoRecords.find((x) => x.id === param.id);
      if (item) {
        const index = this.dbInfoRecords.indexOf(item);
        this.dbInfoRecords.splice(index, 1);

        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }

    updateDbInfoRecord(param: DbInfoRecord) {
      const item = this.dbInfoRecords.find((x) => x.id === param.id);
      if (item) {
        item.appId = param.appId;
        item.title = param.title;
        item.dbKind = param.dbKind;
        item.connectionString = param.connectionString;
        item.memo = param.memo;

        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }
}