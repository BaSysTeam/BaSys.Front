import { Guid } from 'guid-typescript';
import MenuColumn from './menuColumn';

export default class MenuGroupItem {
  uid: string;
  title: string;
  iconClass: string;
  url: string;
  isSeparator: boolean;
  isVisible: boolean;
  items: MenuColumn[]

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.iconClass = data.iconClass || '';
    this.url = data.url || '';
    this.isSeparator = data.isSeparator || false;
    this.isVisible = data.isVisible || true;

    this.items = [];
    if (data.items != null) {
      data.items.forEach((item:any) => {
        this.items.push(new MenuColumn(item));
      });
    }
  }
}
