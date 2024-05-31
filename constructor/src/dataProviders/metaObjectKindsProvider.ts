import axios from 'axios';
import MetaObjectKind from '../models/metaObjectKind';
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetaObjectKindsProvider {
  private readonly BASE_URL = '/api/constructor/v1/MetaObjectKinds';

  async getCollection(): Promise<ResultWrapper<MetaObjectKind[]>> {
    let result: ResultWrapper<MetaObjectKind[]> = new ResultWrapper<MetaObjectKind[]>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getSettingsCollection(): Promise<ResultWrapper<MetaObjectKindSettings[]>> {
    let result = new ResultWrapper<MetaObjectKindSettings[]>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/Settings`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getSettingsItemByName(name: string): Promise<ResultWrapper<MetaObjectKindSettings>> {
    let result: ResultWrapper<MetaObjectKindSettings> = new ResultWrapper<MetaObjectKindSettings>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${name}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async insert(settings: MetaObjectKindSettings): Promise<ResultWrapper<MetaObjectKindSettings>> {
    let result = new ResultWrapper<MetaObjectKindSettings>();

    try {
      const { data } = await axios.post(this.BASE_URL, settings);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async update(settings: MetaObjectKindSettings): Promise<ResultWrapper<number>> {
    let result = new ResultWrapper<number>();

    try {
      const { data } = await axios.put(this.BASE_URL, settings);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async delete(uid: string): Promise<ResultWrapper<number>> {
    let result = new ResultWrapper<number>();

    try {
      const { data } = await axios.delete(`${this.BASE_URL}/${uid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
