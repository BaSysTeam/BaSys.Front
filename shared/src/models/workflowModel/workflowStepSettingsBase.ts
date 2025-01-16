import { Guid } from 'guid-typescript';

export default class WorkflowStepSettingsBase {
  uid: string;
  kindName: string;
  kindUid: string;
  title: string;
  memo: string;
  isActive: boolean;
  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create().toString();
    this.kindName = data.kindName || '';
    this.kindUid = data.kindUid || '';
    this.title = data.title || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || true;
  }
}
