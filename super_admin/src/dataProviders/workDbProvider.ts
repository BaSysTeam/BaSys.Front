import axios from 'axios';
import InitDbRequestDto from '../models/initDbRequestDto';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class WorkDbProvider {
  readonly BASE_URL = '/api/admin/v1/WorkDb';

  async initDb(id: number, payload: InitDbRequestDto): Promise<ResultWrapper<boolean>> {
    let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();

    try {
      const { data } = await axios.post(`${this.BASE_URL}/${id}/initdb`, payload);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
