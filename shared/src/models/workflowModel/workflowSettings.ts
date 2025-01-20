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

  newStep(kind: string, previousUid: string): any {
    let newStep = null;
    const nextStepNumber = this.steps.length + 1;

    switch (kind) {
      case 'sleep':
        newStep = new SleepStepSettings({
          title: `Sleep ${nextStepNumber}`,
          name: `sleep_${nextStepNumber}`,
          previousStepUid: previousUid,
        });
        break;
      case 'message':
        newStep = new MessageStepSettings(
          {
            title: `Message ${nextStepNumber}`,
            name: `message_${nextStepNumber}`,
            previousStepUid: previousUid,
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

  deleteStep(step: any): void {
    const ind = this.steps.indexOf(step);
    if (ind > -1) {
      // Clear references for deleted step.
      this.steps.forEach((currentStep) => {
        if (currentStep.previousStepUid === step.uid) {
          currentStep.previousStepUid = '';
        }
      });

      // Delete step.
      this.steps.splice(ind, 1);
    }
  }
}
