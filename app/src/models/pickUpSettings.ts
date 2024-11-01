export default class PickUpSettings {
  title: string;
  width: string;
  height: string;
  rowsPerPage: number;
  rowsPerPageSource: number[];

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.title = data.title || 'Pick up';
    this.width = data.width || '80%';
    this.height = data.height || '500px';
    this.rowsPerPage = data.rowsPerPage || 10;

    this.rowsPerPageSource = [];
    if (data.rowsPerPageSource) {
      this.rowsPerPageSource = data.rowsPerPageSource;
    } else {
      this.rowsPerPageSource = [10, 20, 50, 100, 500];
    }
  }
}
