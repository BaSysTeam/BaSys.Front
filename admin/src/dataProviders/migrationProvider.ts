import axios from 'axios';
import Migration from '@/models/migration';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MigrationProvider {
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
}
