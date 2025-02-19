export default class AppConstants {
  uid: string;
  dataBaseUid: string;
  applicationTitle: string;
  appVersion: string;
  useWorkflowsScheduler: boolean;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || '';
    this.applicationTitle = data.applicationTitle || '';
    this.appVersion = data.appVersion || '';
    this.dataBaseUid = data.dataBaseUid || '';
    this.useWorkflowsScheduler = data.useWorkflowsScheduler || false;
  }
}
