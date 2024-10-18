import { Guid } from 'guid-typescript';
import MenuSettingsLinkItem from './menuSettingsLinkItem';
import { MenuSettingsLinkKinds } from './menuSettingsLinkKinds';
import MenuSettingsSubItem from './menuSettingsSubItem';
import MenuSettingsColumn from './menuSettingsColumn';
import { MenuSettingsGroupKinds } from './menuSettingsGroupKinds';

export default class MenuSettingsGroupItem {
  uid: string;
  kind: MenuSettingsGroupKinds;
  title: string;
  iconClass: string;
  url: string;
  isVisible: boolean;
  autoFill: boolean;
  itemsPerColumn: number;
  metaObjectKindUid: string;
  items: MenuSettingsColumn[]

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.kind = data.kind || MenuSettingsGroupKinds.Group;
    this.title = data.title || '';
    this.iconClass = data.iconClass || '';
    this.url = data.url || '';
    this.isVisible = data.isVisible || true;

    this.autoFill = data.autoFill || false;
    this.itemsPerColumn = data.itemsPerColumn || 10;
    this.metaObjectKindUid = data.metaObjectKindUid || '';

    this.items = [];
    if (data.items != null) {
      data.items.forEach((item:any) => {
        this.items.push(new MenuSettingsColumn(item));
      });
    }
  }

  newColumn(subGroupTitle: string, itemTitle: string): MenuSettingsColumn {
    const item = new MenuSettingsLinkItem({ title: `${itemTitle} 1`, kind: MenuSettingsLinkKinds.Link });
    const sumItem = new MenuSettingsSubItem({ title: `${subGroupTitle} 1`, items: [item] });
    const menuColumn = new MenuSettingsColumn({ items: [sumItem] });

    this.items.push(menuColumn);

    return menuColumn;
  }

  deleteColumn(item: MenuSettingsColumn): void {
    const ind = this.items.indexOf(item);
    if (ind > -1) {
      this.items.splice(ind, 1);
    }
  }
}
