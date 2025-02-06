import { Guid } from 'guid-typescript';

export default class WorkflowParameter {
  uid: string;
  name: string;
  dataType: string;
  value: object;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create().toString();
    this.name = data.name || '';
    this.dataType = data.dataType || 'string';
    this.value = data.value || '';
  }
}
