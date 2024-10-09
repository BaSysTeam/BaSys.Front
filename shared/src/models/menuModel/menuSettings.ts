import { Guid } from 'guid-typescript';
import MenuSettingsGroupItem from './menuSettingsGroupItem';

export default class MenuSettings {
  uid:string;
  title:string;
  name:string;
  memo:string;
  isActive:boolean;
  menuGroups: MenuSettingsGroupItem[];

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

    this.menuGroups = [];

    if (data.menuGroups != null) {
      data.menuGroups.forEach((menuGroup:any) => {
        this.menuGroups.push(new MenuSettingsGroupItem(menuGroup));
      });
    }
  }
}
