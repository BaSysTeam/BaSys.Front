import axios from 'axios';
import BaseProvider from '@/dataProviders/baseProvider';
import MetaObjectListViewModel from '@/models/metaObjectListViewModel';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetaObjectProvider extends BaseProvider {
  constructor() {
    super('/api/constructor/v1/MetaObjects');
  }

  async getKindList(kindName: string): Promise<ResultWrapper<MetaObjectListViewModel>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${kindName}`));
  }

  async getSettingsListByKindUid(kindUid: string): Promise<ResultWrapper<any[]>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/settings/${kindUid}`));
  }

  async getMetaObjectSettings(kindName: string, objectName: string): Promise<ResultWrapper<any>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${kindName}/${objectName}`));
  }

  async create(settings: MetaObjectStorableSettings): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.post(this.BASE_URL, settings));
  }

  async update(settings: MetaObjectStorableSettings): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.put(this.BASE_URL, settings));
  }

  async deleteAsync(kindName: string, objectName: string): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${kindName}/${objectName}`));
  }
}
