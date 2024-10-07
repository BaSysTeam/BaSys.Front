import { Guid } from 'guid-typescript';
import MenuSubItem from '@/models/menuModel/menuSubItem';

export default class MenuGroupItem {
  uid: string;
  title: string;
  cssClass: string;
  url: string;
  isVisible: boolean;
  items: MenuSubItem[][]

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.cssClass = data.cssClass || '';
    this.url = data.url || '';
    this.isVisible = data.isVisible || true;

    this.items = [];
    if (data.items != null) {
      data.items.forEach((subArray:any[]) => {
        const currentArray: any[] = [];
        subArray.forEach((item:any) => {
          currentArray.push(new MenuSubItem(item));
        });
        this.items.push(currentArray);
      });
    }
  }
}
