import { Guid } from 'guid-typescript';

export default class WorkflowLogRecord {
  uid: string;
  raiseDate: string;
  logMessage: string;
  kind: number;
  level: number;
  version: number;
  origin: string;
  runUid: string;
  workflowUid: string;
  workflowName: string;
  userName: string;
  userUid: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create().toString();
    this.raiseDate = data.raiseDate || '';
    this.logMessage = data.logMessage || '';
    this.kind = data.kind || 0;
    this.level = data.level || 0;
    this.version = data.version || 0;
    this.runUid = data.runUid || '';
    this.origin = data.origin || '';
    this.workflowUid = data.workflowUid || '';
    this.workflowName = data.workflowName || '';
    this.userName = data.userName || '';
    this.userUid = data.userUid || '';
  }
}
