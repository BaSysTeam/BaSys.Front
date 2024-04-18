import axios from 'axios';
import Migration from '@/models/migration';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MigrationsProvider {
  private readonly BASE_URL = 'api/v1/Migrations';

  async getMigrationList(): Promise<ResultWrapper<Migration[]>> {
    let result: ResultWrapper<Migration[]> = new ResultWrapper<Migration[]>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async applyMigration(uid: string): Promise<ResultWrapper<boolean>> {
    let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();

    try {
      const url = `${this.BASE_URL}/Up`;
      const { data } = await axios({
        method: 'post',
        url,
        headers: { 'Content-Type': 'application/json' },
        data: uid,
      });
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async removeMigration(): Promise<ResultWrapper<boolean>> {
    let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();

    try {
      const url = `${this.BASE_URL}/Down`;
      const { data } = await axios.post(url);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async isMigrationRun(): Promise<boolean> {
    let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();

    try {
      const url = `${this.BASE_URL}/IsMigrationRun`;
      const { data } = await axios.get(url);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result.data;
  }
}
