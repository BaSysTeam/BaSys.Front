import { DbType } from '../enums/dbType';

export default class DataType {
    uid!: string;
    title!: string;
    isPrimitive!: boolean;
    dbType!: DbType;
    objectKindUid!: string;
}
