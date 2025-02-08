import axios from 'axios';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';
import User from '../models/user';

export default class AppRecordProvider extends BaseProvider {
  constructor() {
    super('/api/v1/Account');
  }

  async logout(): Promise<ResultWrapper<boolean>> {
    const url = `${this.BASE_URL}/logout`;
    return this.handleRequest(axios.post(url));
  }

  async currentUser(): Promise<ResultWrapper<User>> {
    const url = `${this.BASE_URL}/currentUser`;
    return this.handleRequest(axios.get(url));
  }
}
