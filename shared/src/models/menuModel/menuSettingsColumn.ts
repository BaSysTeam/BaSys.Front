import { Guid } from 'guid-typescript';
import MenuSettingsLinkItem from './menuSettingsLinkItem';
import { MenuSettingsLinkKinds } from './menuSettingsLinkKinds';
import MenuSettingsSubItem from './menuSettingsSubItem';

export default class MenuSettingsColumn {
  uid: string;
  items: MenuSettingsSubItem[];
  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();

    this.items = [];
    if (data.items != null) {
      data.items.forEach((item:any) => {
        this.items.push(new MenuSettingsSubItem(item));
      });
    }
  }

  newSubItem(): MenuSettingsSubItem {
    const item = new MenuSettingsLinkItem({ title: 'Item 1', kind: MenuSettingsLinkKinds.Link });
    const subItem = new MenuSettingsSubItem(
      {
        title: `Sub group ${this.items.length + 1}`,
        items: [item],
      },
    );

    this.items.push(subItem);

    return subItem;
  }

  delete(item: MenuSettingsSubItem): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}
