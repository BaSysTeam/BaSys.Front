export default class MegaMenuItem {
  key: string;
  label: string;
  icon: string;
  url: string;
  items: MegaMenuItem[];
  disabled: boolean;
  visible: boolean;
  target: string;
  separator: boolean;
  style: string;
  class: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.key = data.key || '';
    this.label = data.label || '';
    this.icon = data.icon || '';
    this.url = data.url || '';
    this.items = data.items || [];
    this.disabled = data.disabled || false;
    this.visible = data.visible || true;
    this.target = data.target || '';
    this.separator = data.separator || false;
    this.style = data.style || '';
    this.class = data.class || '';
  }
}
