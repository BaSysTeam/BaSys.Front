import axios from 'axios';
import MetaObjectListViewModel from '@/models/metaObjectListViewModel';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetaObjectProvider {
  private readonly BASE_URL = '/api/constructor/v1/MetaObjects';

  async getKindList(kindName: string): Promise<ResultWrapper<MetaObjectListViewModel>> {
    let result: ResultWrapper<MetaObjectListViewModel> = new
    ResultWrapper<MetaObjectListViewModel>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${kindName}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

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

  async create(settings: MetaObjectStorableSettings): Promise<ResultWrapper<number>> {
    let result = new ResultWrapper<number>();

    try {
      const { data } = await axios.post(this.BASE_URL, settings);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async update(settings: MetaObjectStorableSettings): Promise<ResultWrapper<number>> {
    let result = new ResultWrapper<number>();

    try {
      const { data } = await axios.put(this.BASE_URL, settings);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async deleteAsync(kindName: string, objectName: string): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.delete(`${this.BASE_URL}/${kindName}/${objectName}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
