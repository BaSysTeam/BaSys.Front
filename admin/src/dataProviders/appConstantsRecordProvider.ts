import axios from 'axios';
import AppConstantsRecord from '@/models/appConstantsRecord';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class AppConstantsRecordProvider {
  private readonly BASE_URL = '/api/admin/v1/AppConstantsRecords';

  async getAppConstantsRecord(): Promise<ResultWrapper<AppConstantsRecord>> {
    let result: ResultWrapper<AppConstantsRecord> = new ResultWrapper<AppConstantsRecord>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async createAppConstantsRecord(param: AppConstantsRecord): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.post(this.BASE_URL, param);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async updateAppConstantsRecord(param: AppConstantsRecord): Promise<ResultWrapper<number>> {
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
