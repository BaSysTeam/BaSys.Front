export default class WorkflowInfo {
  createTime: string;
  status: number;
  runUid: string;
  workflowUid: string;
  workflowName: string;
  workflowTitle: string;
  origin: string;
  userName: string;
  userUid: string;

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.createTime = data.createTime || '';
    this.status = data.status || 0;
    this.runUid = data.runUid || '';
    this.workflowUid = data.workflowUid || '';
    this.workflowName = data.workflowName || '';
    this.workflowTitle = data.workflowTitle || '';
    this.origin = data.origin || '';
    this.userName = data.userName || '';
    this.userUid = data.userUid || '';
  }
}
