import DataType from '../models/dataType';
import { DbType } from '../enums/dbTypes';

export default class DataTypeDefaults {
  public static readonly String: DataType = new DataType({
    uid: '0234c067-7868-46b2-ba8e-e22fae5255cb',
    title: 'String',
    isPrimitive: true,
    dbType: DbType.String,
  });

  public static readonly Int: DataType = new DataType({
    uid: 'b327f82a-ea96-416f-9836-785db28eccac',
    title: 'Int',
    isPrimitive: true,
    dbType: DbType.Int32,
  });

  public static readonly Long: DataType = new DataType({
    uid: 'daa57cb0-32eb-4709-b61f-4ea023ae31c3',
    title: 'Long',
    isPrimitive: true,
    dbType: DbType.Int64,
  });

  public static readonly Bool: DataType = new DataType({
    uid: '4bff64cf-eb01-4933-9f3d-b902336751f4',
    title: 'Boolean',
    isPrimitive: true,
    dbType: DbType.Boolean,
  });

  public static readonly Decimal: DataType = new DataType({
    uid: 'a05516ac-baae-4f66-9b67-6703998a6a1b',
    title: 'Decimal',
    isPrimitive: true,
    dbType: DbType.Decimal,
  });

  public static readonly DateTime: DataType = new DataType({
    uid: '9001eafb-efb1-442f-b288-723bb8002b12',
    title: 'DateTime',
    isPrimitive: true,
    dbType: DbType.DateTime,
  });

  public static readonly UniqueIdentifier: DataType = new DataType({
    uid: '6fa9c45b-f514-4fea-a480-8e940636a1df',
    title: 'UniqueIdentifier',
    isPrimitive: true,
    dbType: DbType.Guid,
  });

  public static allTypes(): DataType[] {
    return [
      DataTypeDefaults.String,
      DataTypeDefaults.Int,
      DataTypeDefaults.Long,
      DataTypeDefaults.Bool,
      DataTypeDefaults.Decimal,
      DataTypeDefaults.DateTime,
      DataTypeDefaults.UniqueIdentifier,
    ];
  }

  public static GetPrimaryKeyTypes(): DataType[] {
    return [
      DataTypeDefaults.String,
      DataTypeDefaults.Int,
      DataTypeDefaults.Long,
      DataTypeDefaults.UniqueIdentifier,
    ];
  }

  public static IsPrimitiveType(dataTypeUid: string): boolean {
    const types = DataTypeDefaults.allTypes();
    const result = types.find((x) => x.uid === dataTypeUid);

    if (!result) {
      return false;
    }

    return true;
  }
}
