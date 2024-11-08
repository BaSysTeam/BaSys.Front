import { Guid } from 'guid-typescript';

export default class PickUpColumnSettings {
  uid: string;
  name: string;
  title: string;
  width: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create().toString();
    this.name = data.name || '';
    this.title = data.title || '';
    this.width = data.width || '';
  }
}
