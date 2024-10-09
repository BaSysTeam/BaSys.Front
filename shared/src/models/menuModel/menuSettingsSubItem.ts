import { Guid } from 'guid-typescript';
import MenuSettingsLinkItem from './menuSettingsLinkItem';

export default class MenuSettingsSubItem {
  uid: string;
  title: string;
  isVisible: boolean;
  items: MenuSettingsLinkItem[];

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
        this.items.push(new MenuSettingsLinkItem(item));
      });
    }
  }
}
