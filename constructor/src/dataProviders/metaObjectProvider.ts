import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetaObjectProvider {
  private readonly BASE_URL = '/api/constructor/v1/MetaObjects';

  async getMetaObjectSettings(kindName: string, objectName: string): Promise<ResultWrapper<any>> {
    let result: ResultWrapper<any> = new ResultWrapper<any>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${kindName}/${objectName}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
