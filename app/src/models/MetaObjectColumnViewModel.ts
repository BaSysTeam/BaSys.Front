import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import ControlKindDefaults from '../../../shared/src/dataProviders/controlKindDefaults';
import DataType from '../../../shared/src/models/dataType';
import ControlKind from '../../../shared/src/models/controlKind';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';
import MetaObjectTableColumnRenderSettings from '../../../shared/src/models/metaObjectTableColumnRenderSettings';

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

  constructor(
    column: MetaObjectTableColumn | null,
    dataTypes: DataType[],
    renderSettings: MetaObjectTableColumnRenderSettings[],
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

    const columnRenderSettings = renderSettings.find(
      (item) => item.uid.toLowerCase() === column.uid.toLowerCase(),
    );
    console.log('columnViewModel', this.name, this.uid, columnRenderSettings);

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
      if (columnRenderSettings) {
        if (columnRenderSettings.controlKindUid === ControlKindDefaults.PrimeVueTextArea.uid) {
          this.isTextArea = true;
        } else {
          this.isTextInput = true;
        }
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
      if (columnRenderSettings) {
        if (columnRenderSettings.controlKindUid === ControlKindDefaults.PrimeVueSwitchInput.uid) {
          this.isSwitch = true;
        } else {
          this.isCheckbox = true;
        }
      } else {
        this.isCheckbox = true;
      }

      return;
    }

    const isDateTime = dataType.uid === DataTypeDefaults.DateTime.uid;
    if (isDateTime) {
      if (columnRenderSettings) {
        if (columnRenderSettings.controlKindUid === ControlKindDefaults.PrimeVueDateTimeInput.uid) {
          this.isDateTimeInput = true;
        } else {
          this.isDateInput = true;
        }
      } else {
        this.isDateInput = true;
      }
    }
  }
}
