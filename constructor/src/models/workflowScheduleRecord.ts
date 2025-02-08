import { Guid } from 'guid-typescript';

export default class WorkflowScheduleRecord {
  uid: string;
  workflowUid: string;
  cronExpression: string;
  memo: string;
  isActive: boolean;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create().toString();
    this.workflowUid = data.workflowUid || '';
    this.cronExpression = data.cronExpression || '* * * * *';
    this.memo = data.memo || '';
    this.isActive = data.isActive || false;
  }
}
