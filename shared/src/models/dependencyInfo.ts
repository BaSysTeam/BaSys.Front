import { DependencyKinds } from '../enums/dependencyKinds';

export default class DependencyInfo {
  kind: DependencyKinds;
  fieldUid: string;
  tableUid: string;

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.kind = data.kind || DependencyKinds.HeaderField;
    this.fieldUid = data.fieldUid || '';
    this.tableUid = data.tableUid || '';
  }
}
