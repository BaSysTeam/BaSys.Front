import { Guid } from 'guid-typescript';

export default class WorkflowSettings {
  uid:string;
  title:string;
  name:string;
  memo:string;
  isActive:boolean;
  steps: any[];

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.name = data.name || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || true;

    this.steps = [];
  }
}
