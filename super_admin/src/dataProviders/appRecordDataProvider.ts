import AppRecord from '@/models/appRecord';

export default class AppRecordService {
    private records: Array<AppRecord> = [
      new AppRecord({
        id: 'appRecord_1',
        memo: 'item1',
        title: 'item1',
      }),
      new AppRecord({
        id: 'appRecord_2',
        memo: 'item2',
        title: 'item2',
      }),
      new AppRecord({
        id: 'appRecord_3',
        memo: 'item3',
        title: 'item3',
      }),
      new AppRecord({
        id: 'appRecord_4',
        memo: 'item4',
        title: 'item4',
      }),
      new AppRecord({
        id: 'appRecord_5',
        memo: 'item5',
        title: 'item5',
      }),
    ];

    getAppRecords() {
      return Promise.resolve(this.records);
    }

    addAppRecord(param: AppRecord) {
      const newItem = param;
      newItem.id = this.records[this.records.length - 1].id + 1;
      this.records.push(param);
      return Promise.resolve(true);
    }

    updateAppRecord(param: AppRecord) {
      const item = this.records.find((x) => x.id === param.id);
      if (item) {
        item.title = param.title;
        item.memo = param.memo;

        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }

    deleteAppRecord(param: AppRecord) {
      const item = this.records.find((x) => x.id === param.id);
      if (item) {
        const index = this.records.indexOf(item);
        this.records.splice(index, 1);

        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }
}
