import axios from 'axios';
import MetadataTreeNode from '@/models/metadataTreeNode';
import MetadataGroup from '@/models/metadataGroup';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetadataTreeProvider {
  private readonly BASE_URL = '/api/constructor/v1/MetadataTree';

  async getDefaultNodes(): Promise<ResultWrapper<MetadataTreeNode[]>> {
    let result: ResultWrapper<MetadataTreeNode[]> = new ResultWrapper<MetadataTreeNode[]>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/GetDefaultNodes`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async addMetadataGroup(group: MetadataGroup): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.post(`${this.BASE_URL}/AddMetadataGroup`, group);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getChildren(uid: string): Promise<ResultWrapper<MetadataTreeNode[]>> {
    let result: ResultWrapper<MetadataTreeNode[]> = new ResultWrapper<MetadataTreeNode[]>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/Children/${uid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async deleteMetadataGroup(uid: string): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.delete(`${this.BASE_URL}/MetadataGroup/${uid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
