export default class DataObjectRecordsDialogTab {
  uid: string;
  title: string;
  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || '';
    this.title = data.title || '';
  }
}
