import axios from 'axios';
import DataObjectList from '../models/dataObjectList';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class DataObjectsProvider {
  private readonly BASE_URL = '/api/app/v1/DataObjects';

  async getCollection(kind: string, name: string): Promise<ResultWrapper<DataObjectList>> {
    let result: ResultWrapper<DataObjectList> = new ResultWrapper<DataObjectList>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${kind}/${name}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
