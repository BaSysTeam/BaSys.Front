import DataObjectRecordsDialogTab from '@/models/dataObjectRecordsDialogTab';

export default class DataObjectRecordsDialogViewModel {
  tabs: DataObjectRecordsDialogTab[];
  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.tabs = [];
    if (data.tabs) {
      data.tabs.forEach((item: any) => {
        this.tabs.push(new DataObjectRecordsDialogTab(item));
      });
    }
  }
}
