import DataTableColumnViewModel from '@/models/dataTableColumnViewModel';

export default class DataObjectRecordsDialogTab {
  uid: string;
  title: string;
  columns: DataTableColumnViewModel[];
  isActive: boolean;
  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || '';
    this.title = data.title || '';
    this.isActive = data.isActive || false;

    this.columns = [];
    if (data.columns) {
      data.columns.forEach((item: any) => {
        this.columns.push(new DataTableColumnViewModel(item));
      });
    }
  }
}
