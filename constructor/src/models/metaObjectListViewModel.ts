import MetaObject from '@/models/metaObject';

export default class MetaObjectListViewModel {
  title: string;
  items: MetaObject[];

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.title = data.title || '';
    this.items = [];
    if (data.items) {
      data.items.forEach((item:any) => {
        this.items.push(new MetaObject(item));
      });
    }
  }
}
