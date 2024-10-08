import { Guid } from 'guid-typescript';
import MenuSubItem from './menuSubItem';

export default class MenuColumn {
  uid: string;
  items: MenuSubItem[];
  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();

    this.items = [];
    if (data.items != null) {
      data.items.forEach((item:any) => {
        this.items.push(new MenuSubItem(item));
      });
    }
  }
}
