import { Guid } from 'guid-typescript';

export default class MenuLinkItem {
  uid: string;
  title: string;
  url: string;
  isVisible: boolean;

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.url = data.url || '';
    this.isVisible = data.isActive || true;
  }
}
