import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';

export default class MetaObjectColumnFlags {
  isPrimaryKey = false;
  isString = false;
  isBoolean = false;
  isNumber = false;
  isInt = false;
  isDate = false;

  constructor(column: MetaObjectTableColumn | null, dataTypes: DataType[]) {
    if (column == null || dataTypes == null) {
      return;
    }

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
