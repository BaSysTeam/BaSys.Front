import { Guid } from 'guid-typescript';
import { MenuSettingsLinkKinds } from './menuSettingsLinkKinds';

export default class MenuSettingsLinkItem {
  uid: string;
  kind: MenuSettingsLinkKinds;
  title: string;
  iconClass: string;
  url: string;
  isVisible: boolean;

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.kind = data.kind || MenuSettingsLinkKinds.Link;
    this.title = data.title || '';
    this.iconClass = data.iconClass || '';
    this.url = data.url || '';
    this.isVisible = data.isActive || true;
  }
}
