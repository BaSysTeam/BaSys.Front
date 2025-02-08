import axios from 'axios';
import AppConstants from '@/models/appConstants';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class AppConstantsProvider extends BaseProvider {
  constructor() {
    super('/api/admin/v1/AppConstants');
  }

  async getAppConstants(): Promise<ResultWrapper<AppConstants>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }

  async updateAppConstants(param: AppConstants): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.put(this.BASE_URL, param));
  }
}
