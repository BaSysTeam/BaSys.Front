import WorkflowStepSettingsBase from './workflowStepSettingsBase';

export default class MessageStepSettings extends WorkflowStepSettingsBase {
  message: string;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    super(data);
    this.kindName = 'message';
    this.kindUid = 'E192C288-154E-4778-B92C-64DA27279796'.toLowerCase();
    this.message = data.message || '';
  }
}
