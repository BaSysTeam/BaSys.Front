import { Guid } from 'guid-typescript';
import { MenuSettingsGroupKinds } from './menuSettingsGroupKinds';
import MenuSettingsColumn from './menuSettingsColumn';

export default class MenuSettingsGroupItem {
  uid: string;
  kind: MenuSettingsGroupKinds;
  title: string;
  iconClass: string;
  url: string;
  isVisible: boolean;
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

    this.items = [];
    if (data.items != null) {
      data.items.forEach((item:any) => {
        this.items.push(new MenuSettingsColumn(item));
      });
    }
  }
}
