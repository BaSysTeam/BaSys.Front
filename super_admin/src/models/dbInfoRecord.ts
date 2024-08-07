import { DbKinds } from '@/enums/dbKinds';

export default class DbInfoRecord {
    id: number;
    appId: string;
    title: string;
    name: string;
    dbKind: DbKinds;
    connectionString: string;
    memo: string;
    isDeleted: boolean;
    isExists?: boolean;

    constructor(options: { [key: string]: any }) {
      this.id = options.id;
      this.appId = options.appId || '';
      this.title = options.title || '';
      this.name = options.name || '';
      this.dbKind = options.dbKind || DbKinds.SqlServer;
      this.connectionString = options.connectionString || '';
      this.memo = options.memo || '';
      this.isDeleted = options.isDeleted || false;
      this.isExists = options.isExists;
    }

    equals(obj: any): boolean {
      return obj instanceof DbInfoRecord && this.id === obj.id;
    }

    toString(): string {
      return `${this.title}`;
    }
}
