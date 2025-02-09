import axios from 'axios';
import SelectItem from '@/models/selectItem';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class SelectItemsProvider extends BaseProvider {
  private readonly resultsCache: any = {};

  constructor() {
    super('/api/app/v1/SelectItems');
  }

  async getCollection(dataTypeUid: string): Promise<ResultWrapper<any>> {
    const cachedResult = this.resultsCache[dataTypeUid];
    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.handleRequest(axios.get(`${this.BASE_URL}/${dataTypeUid}`));

    if (result.isOK) {
      this.resultsCache[dataTypeUid] = result;
    }

    return result;
  }

  async getItem(dataTypeUid: string, uid: string)
    : Promise<ResultWrapper<SelectItem>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${dataTypeUid}/${uid}`));
  }
}
