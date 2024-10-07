import { Guid } from 'guid-typescript';
import MenuLinkItem from './menuLinkItem';

export default class MenuSubItem {
  uid: string;
  title: string;
  isVisible: boolean;
  items: MenuLinkItem[];

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.isVisible = data.isVisible || true;

    this.items = [];
    if (data.items != null) {
      data.items.forEach((item:any) => {
        this.items.push(new MenuLinkItem(item));
      });
    }
  }
}
