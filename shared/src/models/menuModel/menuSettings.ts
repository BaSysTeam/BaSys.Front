import { Guid } from 'guid-typescript';
import MenuSettingsColumn from './menuSettingsColumn';
import MenuSettingsSubItem from './menuSettingsSubItem';
import MenuSettingsLinkItem from './menuSettingsLinkItem';
import { MenuSettingsLinkKinds } from './menuSettingsLinkKinds';
import { MenuSettingsGroupKinds } from './menuSettingsGroupKinds';
import MenuSettingsGroupItem from './menuSettingsGroupItem';

export default class MenuSettings {
  uid:string;
  title:string;
  name:string;
  memo:string;
  isActive:boolean;
  items: MenuSettingsGroupItem[];

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.name = data.name || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || true;

    this.items = [];

    if (data.items != null) {
      data.items.forEach((menuGroup:any) => {
        this.items.push(new MenuSettingsGroupItem(menuGroup));
      });
    }
  }

  addGroup(): MenuSettingsGroupItem {
    const item = new MenuSettingsLinkItem({ title: 'Item 1', kind: MenuSettingsLinkKinds.Link });
    const sumItem = new MenuSettingsSubItem({ title: 'Sub group 1', items: [item] });
    const menuColumn = new MenuSettingsColumn({ items: [sumItem] });

    const newGroup = new MenuSettingsGroupItem(
      { title: `Menu ${this.items.length + 1}`, kind: MenuSettingsGroupKinds.Group, items: [menuColumn] },
    );

    this.items.push(newGroup);

    return newGroup;
  }

  addItem(): MenuSettingsGroupItem {
    const newGroup = new MenuSettingsGroupItem(
      { title: 'Item', kind: MenuSettingsGroupKinds.Link },
    );

    this.items.push(newGroup);

    return newGroup;
  }

  addSeparator(): MenuSettingsGroupItem {
    const newGroup = new MenuSettingsGroupItem(
      { title: 'Separator', kind: MenuSettingsGroupKinds.Separator },
    );

    this.items.push(newGroup);

    return newGroup;
  }

  deleteItem(item: MenuSettingsGroupItem): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}
