import axios from 'axios';
import MetadataTreeNode from '@/models/metadataTreeNode';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetadataTreeProvider {
  private readonly BASE_URL = '/api/constructor/v1/MetadataTree';

  async getMetadataTree(): Promise<ResultWrapper<MetadataTreeNode[]>> {
    let result: ResultWrapper<MetadataTreeNode[]> = new ResultWrapper<MetadataTreeNode[]>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
