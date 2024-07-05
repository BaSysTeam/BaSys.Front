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
  isString = false;
  isBoolean = false;
  isNumber = false;
  isInt = false;
  isDate = false;

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

    this.isPrimaryKey = column.primaryKey;

    if (this.isPrimaryKey) {
      return;
    }

    const dataType = dataTypes.find((x) => x.uid === column.dataTypeUid);

    if (!dataType) {
      return;
    }

    this.isString = dataType.uid === DataTypeDefaults.String.uid;
    if (this.isString) {
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

    this.isBoolean = dataType.uid === DataTypeDefaults.Bool.uid;
    if (this.isBoolean) {
      return;
    }

    this.isDate = dataType.uid === DataTypeDefaults.DateTime.uid;
  }
}
