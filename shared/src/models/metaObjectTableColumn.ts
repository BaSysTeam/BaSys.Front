import { Guid } from 'guid-typescript';
import MetaObjectKindStandardColumn from './metaObjectKindStandardColumn';
import MetaObjectTableColumnRenderSettings from './metaObjectTableColumnRenderSettings';
import MetaObjectTableColumnDataSettings from './metaObjectTableColumnDataSettings';
import DependencyInfo from './dependencyInfo';

export default class MetaObjectTableColumn {
  uid:string;
  title:string;
  name:string;
  formula:string;
  isStandard:boolean;
  // dataTypeUid:string;
  // stringLength:number;
  // numberDigits:number;
  // primaryKey:boolean;
  // required:boolean;
  // unique:boolean;
  // defaultValue: string;

  renderSettings:MetaObjectTableColumnRenderSettings;
  dataSettings: MetaObjectTableColumnDataSettings;

  dependencies: DependencyInfo[];

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.uid = data.uid || Guid.create().toString();
    this.title = data.title || '';
    this.name = data.name || '';

    this.isStandard = data.isStandard || false;

    this.dataSettings = new MetaObjectTableColumnDataSettings(data.dataSettings);
    this.renderSettings = new MetaObjectTableColumnRenderSettings(data.renderSettings);

    this.formula = data.formula || '';
    this.dependencies = [];
    if (data.dependencies != null) {
      data.dependencies.forEach((item: any) => {
        this.dependencies.push(new DependencyInfo(item));
      });
    }
  }

  fillByStandardColumn(standardColumn: MetaObjectKindStandardColumn): void {
    this.uid = standardColumn.uid;
    this.title = standardColumn.title;
    this.name = standardColumn.name;
    this.dataSettings = new MetaObjectTableColumnDataSettings(standardColumn.dataSettings);
    this.isStandard = true;
  }
}
