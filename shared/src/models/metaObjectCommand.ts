import { Guid } from 'guid-typescript';
import MetaObjectCommandParameter from './metaObjectCommandParameter';

export default class MetaObjectCommand {
  uid: string;
  tableUid: string;
  kind: number;
  title: string;
  name: string;
  expression: string;
  memo: string;
  isActive:boolean;
  parameters: MetaObjectCommandParameter[];

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.name = data.name || '';
    this.tableUid = data.tableUid;
    this.kind = data.kind || 0;
    this.expression = data.expression || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || true;

    this.parameters = [];
    if (data.parameters != null) {
      data.parameters.forEach((param: any) => {
        this.parameters.push(new MetaObjectCommandParameter(param));
      });
    }
  }

  setParameterValue(name: string, value: string): void {
    const parameter = this.parameters.find((param: any) => param.name === name);
    if (parameter) {
      parameter.value = value;
    }
  }

  getParameterValue(name: string): string {
    const parameter = this.parameters.find((param: any) => param.name === name);
    if (parameter) {
      return parameter.value;
    }

    return '';
  }
}
