import { Guid } from 'guid-typescript';
import WorkflowStepKind from './workflowStepKind';
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

    if (data.steps != null) {
      data.steps.forEach((step: any) => {
        if (step.kindUid === WorkflowStepKind.Sleep.uid) {
          this.steps.push(new SleepStepSettings(step));
        } else if (step.kindUid === WorkflowStepKind.Message.uid) {
          this.steps.push(new MessageStepSettings(step));
        } else {
          throw new Error(`Wrong step kind ${step.kindUid}`);
        }
      });
    }
  }

  newStep(kind: string, params: any): any {
    let newStep = null;

    switch (kind) {
      case 'sleep':
        newStep = new SleepStepSettings(
          params,
        );
        break;
      case 'message':
        newStep = new MessageStepSettings(
          params,
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
