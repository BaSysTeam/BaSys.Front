import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MenusProvider {
  private readonly BASE_URL = '/api/app/v1/Menus';

  async getCollectionAsync(): Promise<ResultWrapper<any[]>> {
    let result: ResultWrapper<any[]> = new ResultWrapper<any[]>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
