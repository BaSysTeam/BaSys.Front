import { Guid } from 'guid-typescript';

export default class MenuLinkItem {
  uid: string;
  title: string;
  iconClass: string;
  url: string;
  isSeparator: boolean;
  isVisible: boolean;

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.iconClass = data.iconClass || '';
    this.url = data.url || '';
    this.isSeparator = data.isSeparator || false;
    this.isVisible = data.isActive || true;
  }
}
