import { Guid } from 'guid-typescript';
import SleepStepSettings from './sleepStepSettings';
import MessageStepSettings from './messageStepSettings';
import WorkflowStepSettingsBase from './workflowStepSettingsBase';

export default class WorkflowSettings {
  uid: string;
  title: string;
  name: string;
  memo: string;
  isActive: boolean;
  steps: WorkflowStepSettingsBase[];

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.uid = data.uid || Guid.create()
      .toString();
    this.title = data.title || '';
    this.name = data.name || '';
    this.memo = data.memo || '';
    this.isActive = data.isActive || true;

    this.steps = [];
  }

  newStep(kind: string): any {
    let newStep = null;
    const nextStepNumber = this.steps.length + 1;

    switch (kind) {
      case 'sleep':
        newStep = new SleepStepSettings({
          title: `Sleep ${nextStepNumber}`,
          name: `sleep_${nextStepNumber}`,
        });
        break;
      case 'message':
        newStep = new MessageStepSettings(
          {
            title: `Message ${nextStepNumber}`,
            name: `message_${nextStepNumber}`,
          },
        );
        break;
      default:
        throw new Error(`Wrong step kind ${kind}`);
    }

    if (newStep) {
      this.steps.push(newStep);
    }
    return newStep;
  }
}
