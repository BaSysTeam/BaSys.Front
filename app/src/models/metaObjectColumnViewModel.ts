import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import ControlKindDefaults from '../../../shared/src/dataProviders/controlKindDefaults';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';

export default class MetaObjectColumnViewModel {
  uid = '';
  name = '';
  title = '';
  dataTypeUid = '';
  required = false;
  numberDigits = 0;

  isPrimaryKey = false;

  isTextInput = false;
  isTextArea = false;

  isCheckbox = false;
  isSwitch = false;

  isNumber = false;
  isInt = false;

  isDateInput = false;
  isDateTimeInput = false;

  isDropdown = false;

  readonly = false;
  style: any = { width: 'auto', minWidth: 'auto', maxWidth: 'auto' };

  constructor(
    column: MetaObjectTableColumn | null,
    dataTypes: DataType[] | null,
  ) {
    if (column == null || dataTypes == null) {
      return;
    }

    this.name = column.name;
    this.uid = column.uid;
    this.title = column.title;
    this.dataTypeUid = column.dataTypeUid;
    this.required = column.required;
    this.numberDigits = column.numberDigits;

    this.isPrimaryKey = column.primaryKey;

    if (this.isPrimaryKey) {
      return;
    }

    const dataType = dataTypes.find((x) => x.uid === column.dataTypeUid);

    if (!dataType) {
      return;
    }

    if (!dataType.isPrimitive) {
      this.isDropdown = true;
      return;
    }

    const isString = dataType.uid === DataTypeDefaults.String.uid;
    if (isString) {
      if (column.renderSettings.controlKindUid === ControlKindDefaults.PrimeVueTextArea.uid) {
        this.isTextArea = true;
      } else {
        this.isTextInput = true;
      }
      return;
    }

    this.isInt = dataType.uid === DataTypeDefaults.Int.uid
      || dataType.uid === DataTypeDefaults.Long.uid;
    if (this.isInt) {
      return;
    }

    this.isNumber = dataType.uid === DataTypeDefaults.Decimal.uid;
    if (this.isNumber) {
      return;
    }

    const isBoolean = dataType.uid === DataTypeDefaults.Bool.uid;
    if (isBoolean) {
      if (column.renderSettings.controlKindUid === ControlKindDefaults.PrimeVueSwitchInput.uid) {
        this.isSwitch = true;
      } else {
        this.isCheckbox = true;
      }
      return;
    }

    const isDateTime = dataType.uid === DataTypeDefaults.DateTime.uid;
    if (isDateTime) {
      if (column.renderSettings.controlKindUid === ControlKindDefaults.PrimeVueDateTimeInput.uid) {
        this.isDateTimeInput = true;
      } else {
        this.isDateInput = true;
      }
    }
  }

  setWidth(widthExpression: string): void {
    this.style.width = widthExpression;
    this.style.maxWidth = widthExpression;
    this.style.minWidth = widthExpression;
  }

  setDefaultStyle(): void {
    if (this.isSwitch || this.isCheckbox) {
      this.setWidth('30px');
    } else if (this.isDropdown) {
      this.setWidth('250px');
    } else if (this.isNumber || this.isInt) {
      this.setWidth('100px');
      this.style.textAlign = 'right';
    } else if (this.isDateInput) {
      this.setWidth('70px');
    } else if (this.isDateTimeInput) {
      this.setWidth('120px');
    }
  }
}
