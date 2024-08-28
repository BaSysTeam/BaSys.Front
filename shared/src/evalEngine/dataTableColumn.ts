export default class DataTableColumn {
  name: string;
  dataType: string;
  formula: string;
  defaultValue: any;

  constructor(params: any) {
    this.name = params.name;
    if (!this.name) {
      throw new Error('Name of DataTableColumn cannot be empty.');
    }

    this.dataType = params.dataType || 'string';
    this.checkDataType();

    this.formula = params.formula || '';
    this.defaultValue = params.defaultValue || this.defaultValueOfType(this.dataType);
  }

  private checkDataType(): void {
    const availableTypes = ['string', 'number', 'boolean', 'date'];

    if (availableTypes.indexOf(this.dataType) === -1) {
      throw new Error(`Data type ${this.dataType} not supported in DataTable.`);
    }
  }

  private defaultValueOfType(dataType: string): any {
    switch (dataType) {
      case 'string':
        return '';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'date':
        return new Date('1980-01-01');
      default:
        throw new Error(`Data type ${dataType} not supported in DataTable.`);
    }
  }
}
