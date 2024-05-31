export default class ChangePassword {
  oldPassword: string;
  newPassword: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.oldPassword = data.oldPassword || '';
    this.newPassword = data.newPassword || '';
  }
}
