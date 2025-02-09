import axios from 'axios';
import InitDbRequestDto from '../models/initDbRequestDto';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class WorkDbProvider extends BaseProvider {
  constructor() {
    super('/api/admin/v1/WorkDb');
  }

  async initDb(id: number, payload: InitDbRequestDto): Promise<ResultWrapper<boolean>> {
    return this.handleRequest(axios.post(`${this.BASE_URL}/${id}/initdb`, payload));
  }
}
