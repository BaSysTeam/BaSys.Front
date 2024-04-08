import axios from 'axios';
import AppConstants from '@/models/appConstants';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class AppConstantsProvider {
  private readonly BASE_URL = '/api/admin/v1/AppConstants';

  async getAppConstants(): Promise<ResultWrapper<AppConstants>> {
    let result: ResultWrapper<AppConstants> = new ResultWrapper<AppConstants>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async updateAppConstants(param: AppConstants): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.put(this.BASE_URL, param);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
