export default class DataTableColumnViewModel {
  uid: string;
  name: string;
  title: string;
  width: string;
  dataType: string;
  numberDigits: number;
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
    this.numberDigits = data.numberDigits || 0;
    this.isReference = data.isReference || false;

    this.style = { width: 'auto', minWidth: 'auto', maxWidth: 'auto' };
    if (this.width) {
      this.setWidth(this.width);
    }
    if (this.isNumber && !this.isReference) {
      this.style.textAlign = 'right';
    }
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

  setWidth(widthExpression: string): void {
    this.style.width = widthExpression;
    this.style.maxWidth = widthExpression;
    this.style.minWidth = widthExpression;
  }
}
