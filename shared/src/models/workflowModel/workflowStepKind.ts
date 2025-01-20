export default class WorkflowStepKind {
  uid: string;
  name: string;
  constructor(uid: string, name: string) {
    this.uid = uid;
    this.name = name;
  }

  public static readonly Sleep = new WorkflowStepKind(
    '2A5ACA6D-2C41-4BD2-9E03-B35DF7DAB23E'.toLowerCase(),
    'sleep',
  );

  public static readonly Message = new WorkflowStepKind(
    'E192C288-154E-4778-B92C-64DA27279796'.toLowerCase(),
    'message',
  );
}
