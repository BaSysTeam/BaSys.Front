export default class Language {
  id: number;
  name: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.id = data.id || 0;
    this.name = data.name || '';
  }
}
