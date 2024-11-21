import { Guid } from 'guid-typescript';

export default class PickUpColumnSettings {
  uid: string;
  name: string;
  title: string;
  dataType: string;
  filterDataType: string;
  style: any;
  isBoolean: boolean;
  isNumber: boolean;
  isDate: boolean;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create().toString();
    this.name = data.name || '';
    this.title = data.title || '';
    this.dataType = data.dataType || 'string';

    this.style = { width: 'auto', minWidth: 'auto', maxWidth: 'auto' };

    if (data.width) {
      this.style.width = data.width;
      this.style.minWidth = data.width;
      this.style.maxWidth = data.width;
    }

    this.isBoolean = this.dataType === 'boolean';
    this.isNumber = this.dataType === 'number';
    this.isDate = this.dataType === 'date';

    this.filterDataType = 'text';
    if (this.isNumber) {
      this.filterDataType = 'numeric';
    } else if (this.isBoolean) {
      this.filterDataType = 'boolean';
    } else if (this.isDate) {
      this.filterDataType = 'date';
    }
  }
}
