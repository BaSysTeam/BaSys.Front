export default class DataTableColumnViewModel {
  uid: string;
  name: string;
  title: string;
  width: string;
  dataType: string;
  isReference: boolean;
  style: any;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }
    this.uid = data.uid || '';
    this.name = data.name || '';
    this.title = data.title || '';
    this.width = data.width || '';
    this.dataType = data.dataType || '';
    this.isReference = data.isReference || false;

    this.style = {};
  }

  get isBoolean(): boolean {
    return this.dataType === 'boolean';
  }

  get isNumber(): boolean {
    return this.dataType === 'number';
  }

  get isDate(): boolean {
    return this.dataType === 'date';
  }
}
