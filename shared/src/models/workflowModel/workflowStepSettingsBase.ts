import { Guid } from 'guid-typescript';

export default class WorkflowStepSettingsBase {
  uid: string;
  previousStepUid: string;
  kindName: string;
  kindUid: string;
  title: string;
  name: string;
  memo: string;
  isActive: boolean;
  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create().toString();
    this.previousStepUid = data.previousStepUid || '';
    this.kindName = data.kindName || '';
    this.kindUid = data.kindUid || '';
    this.title = data.title || '';
    this.name = data.name || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || true;
  }
}
