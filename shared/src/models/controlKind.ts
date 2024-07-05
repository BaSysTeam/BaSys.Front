import DataType from './dataType';

export default class ControlKind {
  uid: string;
  name: string;
  title: string;
  appliesFor: DataType[];

  constructor(params: any = {}) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || '';
    this.title = data.title || '';
    this.name = data.name || '';

    this.appliesFor = [];
    if (data.appliesFor) {
      data.appliesFor.forEach((item: any) => {
        const newItem = new DataType(item);
        this.appliesFor.push(newItem);
      });
    }
  }
}
