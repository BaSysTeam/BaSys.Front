import axios from 'axios';
import ResultWrapper from '../models/resultWrapper';
import SelectQueryModel from '../evalEngine/selectQueryModel';

export default class QueriesProvider {
  private readonly BASE_URL = '/api/constructor/v1/Queries';

  async execute(queryModel: SelectQueryModel): Promise<ResultWrapper<any>> {
    let result = new ResultWrapper<any>();

    try {
      const { data } = await axios.post(`${this.BASE_URL}/Execute`, queryModel);
      console.log('Query executed', data);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
