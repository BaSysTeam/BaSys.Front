import { Guid } from 'guid-typescript';
import MetaObjectTableColumnRenderSettings from './metaObjectTableColumnRenderSettings';
import DependencyInfo from './dependencyInfo';

export default class MetaObjectTableColumn {
  uid:string;
  title:string;
  name:string;
  dataTypeUid:string;
  stringLength:number;
  numberDigits:number;
  primaryKey:boolean;
  required:boolean;
  unique:boolean;
  isStandard:boolean;
  renderSettings:MetaObjectTableColumnRenderSettings;
  formula:string;
  dependencies: DependencyInfo[];

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.name = data.name || '';
    this.dataTypeUid = data.dataTypeUid || '';
    this.stringLength = data.stringLength || 100;
    this.numberDigits = data.numberDigits || 2;
    this.primaryKey = data.primaryKey || false;
    this.required = data.required || false;
    this.unique = data.unique || false;
    this.isStandard = data.isStandard || false;

    this.renderSettings = new MetaObjectTableColumnRenderSettings(data.renderSettings);

    this.formula = data.formula || '';
    this.dependencies = [];
    if (data.dependencies != null) {
      data.dependencies.forEach((item: any) => {
        this.dependencies.push(new DependencyInfo(item));
      });
    }
  }
}
