import { Guid } from 'guid-typescript';
import { MenuSettingsLinkKinds } from './menuSettingsLinkKinds';
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

  newItem(itemTitle: string): MenuSettingsLinkItem {
    const newItem = new MenuSettingsLinkItem(
      {
        title: `${itemTitle} ${this.items.length + 1}`,
        kind: MenuSettingsLinkKinds.Link,
      },
    );

    this.items.push(newItem);

    return newItem;
  }

  newSeparator(itemTitle: string): MenuSettingsLinkItem {
    const newItem = new MenuSettingsLinkItem(
      {
        title: `${itemTitle} ${this.items.length + 1}`,
        kind: MenuSettingsLinkKinds.Separator,
      },
    );

    this.items.push(newItem);

    return newItem;
  }

  delete(item: MenuSettingsLinkItem): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}
