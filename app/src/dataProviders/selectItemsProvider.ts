import axios from 'axios';
import SelectItem from '@/models/selectItem';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class SelectItemsProvider {
  private readonly BASE_URL = '/api/app/v1/SelectItems';

  async getCollection(dataTypeUid: string): Promise<ResultWrapper<SelectItem[]>> {
    let result: ResultWrapper<SelectItem[]> = new ResultWrapper<SelectItem[]>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${dataTypeUid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getItem(dataTypeUid: string, uid: string)
    : Promise<ResultWrapper<SelectItem>> {
    let result: ResultWrapper<SelectItem> = new ResultWrapper<SelectItem>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${dataTypeUid}/${uid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
