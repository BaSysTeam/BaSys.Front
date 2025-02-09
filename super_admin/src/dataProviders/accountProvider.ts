import axios from 'axios';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class AppRecordProvider extends BaseProvider {
  constructor() {
    super('/api/sa/v1/Account');
  }

  async logout(): Promise<ResultWrapper<boolean>> {
    const url = `${this.BASE_URL}/logout`;
    return this.handleRequest(axios.post(url));
  }
}
