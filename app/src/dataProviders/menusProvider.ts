import axios from 'axios';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MenusProvider extends BaseProvider {
  constructor() {
    super('/api/app/v1/Menus');
  }

  async getCollectionAsync(): Promise<ResultWrapper<any[]>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}`));
  }
}
