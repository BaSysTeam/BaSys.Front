export default class DataObjectDetailsTable {
  name: string;
  title: string;
  uid: string;
  isModified: boolean;
  rows: any[];

  constructor(params: any) {
    let data: any = {};
    if (params) {
      data = params;
    }

    this.name = data.name || '';
    this.title = data.title || '';
    this.uid = data.uid || '';
    this.isModified = data.isModified || false;
    this.rows = [];
    if (data.rows) {
      data.rows.forEach((row: any) => {
        this.rows.push(row);
      });
    }
  }
}
