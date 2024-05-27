export default class UserSettings {
  uid: string;
  userUid: string;
  userName: string;
  language: number;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || '';
    this.userUid = data.userUid || '';
    this.userName = data.userName || '';
    this.language = data.language || 0;
  }
}
