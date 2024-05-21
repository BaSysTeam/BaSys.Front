import axios from 'axios';
import MetadataTreeNode from '@/models/metadataTreeNode';
import MetaObjectCreateDto from '@/models/metaObjectCreateDto';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetadataTreeNodesProvider {
  private readonly BASE_URL = '/api/constructor/v1/MetadataTreeNodes';

  async getStandard(): Promise<ResultWrapper<MetadataTreeNode[]>> {
    let result: ResultWrapper<MetadataTreeNode[]> = new ResultWrapper<MetadataTreeNode[]>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/Standard`);
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

  async getGroups(): Promise<ResultWrapper<MetadataTreeNode[]>> {
    let result: ResultWrapper<MetadataTreeNode[]> = new ResultWrapper<MetadataTreeNode[]>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/Groups`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async create(node: MetadataTreeNode): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.post(this.BASE_URL, node);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async update(node: MetadataTreeNode): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.put(this.BASE_URL, node);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async createMetaObject(dto: MetaObjectCreateDto): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const url = `${this.BASE_URL}/MetaObject`;
      const { data } = await axios.post(url, dto);
      result = data;
    } catch (error) {
      console.error('error', error);
    }
    return result;
  }

  async delete(node: MetadataTreeNode): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.delete(this.BASE_URL, { data: node });
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
