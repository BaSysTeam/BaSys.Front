import { Guid } from 'guid-typescript';
import MenuGroupItem from './menuGroupItem';

export default class MenuSettings {
  uid:string;
  title:string;
  name:string;
  memo:string;
  isVisible:boolean;
  menuGroups: MenuGroupItem[];

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.name = data.name || '';
    this.memo = data.memo || '';
    this.isVisible = data.isVisible || true;

    this.menuGroups = [];
    if (data.menuGroups != null) {
      data.menuGroups.forEach((menuGroup:any) => {
        this.menuGroups.push(new MenuGroupItem(menuGroup));
      });
    }
  }
}
