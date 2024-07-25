export default class DataObjectDetailsTable {
  name: string;
  uid: string;
  rows: any[];

  constructor(params: any) {
    let data: any = {};
    if (params) {
      data = params;
    }

    this.name = data.name || '';
    this.uid = data.uid || '';
    this.rows = [];
    if (data.rows) {
      data.rows.forEach((row: any) => {
        this.rows.push(row);
      });
    }
  }
}
