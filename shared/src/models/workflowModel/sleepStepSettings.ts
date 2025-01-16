import { Guid } from 'guid-typescript';
import WorkflowStepSettingsBase from './workflowStepSettingsBase';

export default class SleepStepSettings extends WorkflowStepSettingsBase {
  delay: string;
  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    super(data);
    this.kindName = 'sleep';
    this.kindUid = '2A5ACA6D-2C41-4BD2-9E03-B35DF7DAB23E'.toLowerCase();
    this.delay = data.delay || '';
  }
}
