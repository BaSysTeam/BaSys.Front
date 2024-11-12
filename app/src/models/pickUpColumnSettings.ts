import { Guid } from 'guid-typescript';

export default class PickUpColumnSettings {
  uid: string;
  name: string;
  title: string;
  width: string;
  dataType: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create().toString();
    this.name = data.name || '';
    this.title = data.title || '';
    this.width = data.width || '';
    this.dataType = data.dataType || '';
  }

  get isBoolean(): boolean {
    return this.dataType === 'boolean';
  }

  get isNumber(): boolean {
    return this.dataType === 'number';
  }
}
