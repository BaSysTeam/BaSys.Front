export default class SelectItem {
  value: any;
  text: string;

  constructor(params: any) {
    let data: any = {};
    if (params) {
      data = params;
    }

    this.text = data.text || '';
    this.value = data.value || '';
  }
}
