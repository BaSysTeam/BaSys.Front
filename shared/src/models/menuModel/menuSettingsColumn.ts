import { Guid } from 'guid-typescript';
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
}
