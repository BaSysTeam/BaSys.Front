import axios from 'axios';
import MetadataKind from '../models/metadataKind';
import MetadataKindSettings from '../models/metadataKindSettings';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetadataKindsProvider {
  private readonly BASE_URL = '/api/constructor/v1/MetadataKinds';

  async getCollection(): Promise<ResultWrapper<MetadataKind[]>> {
    let result: ResultWrapper<MetadataKind[]> = new ResultWrapper<MetadataKind[]>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getSettingsItemByName(name: string): Promise<ResultWrapper<MetadataKindSettings>> {
    let result: ResultWrapper<MetadataKindSettings> = new ResultWrapper<MetadataKindSettings>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${name}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async insert(settings: MetadataKindSettings): Promise<ResultWrapper<MetadataKindSettings>> {
    let result = new ResultWrapper<MetadataKindSettings>();

    try {
      const { data } = await axios.post(this.BASE_URL, settings);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async update(settings: MetadataKindSettings): Promise<ResultWrapper<number>> {
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
