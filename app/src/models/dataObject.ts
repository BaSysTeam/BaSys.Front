export default class DataObject {
  header: { [key: string]: any };

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.header = data.header || {};
  }
}
