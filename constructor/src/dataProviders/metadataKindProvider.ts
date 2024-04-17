import axios from 'axios';
import MetadataKind from '../models/metadataKind';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetadataKindProvider {
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
}
