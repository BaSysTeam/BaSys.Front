import axios from 'axios';
import Migration from '@/models/migration';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MigrationsProvider extends BaseProvider {
  constructor() {
    super('api/v1/Migrations');
  }

  async getMigrationList(): Promise<ResultWrapper<Migration[]>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }

  async applyMigration(uid: string): Promise<ResultWrapper<boolean>> {
    const url = `${this.BASE_URL}/Up`;
    return this.handleRequest(axios.post(url, uid));
  }

  async removeMigration(): Promise<ResultWrapper<boolean>> {
    const url = `${this.BASE_URL}/Down`;
    return this.handleRequest(axios.post(url));
  }

  async isMigrationRun(): Promise<any> {
    const url = `${this.BASE_URL}/IsMigrationRun`;
    const result = await this.handleRequest(axios.get(url));
    return result.data;
  }

  async cancelMigration(): Promise<ResultWrapper<boolean>> {
    const url = `${this.BASE_URL}/CancelMigration`;
    return this.handleRequest(axios.get(url));
  }
}
