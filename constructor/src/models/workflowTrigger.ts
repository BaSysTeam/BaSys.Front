import { Guid } from 'guid-typescript';

export default class WorkflowTrigger {
  uid: string;
  metaObjectKindUid: string;
  metaObjectUid: string;
  eventUid: string;
  eventName: string;
  workflowUid: string;
  workflowTitle: string;
  memo: string;
  isActive: boolean;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create().toString();
    this.metaObjectKindUid = data.metaObjectKindUid || '';
    this.metaObjectUid = data.metaObjectUid || '';
    this.eventUid = data.eventUid || '';
    this.eventName = data.eventName || '';
    this.workflowUid = data.workflowUid || '';
    this.workflowTitle = data.workflowTitle || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || false;
  }
}
