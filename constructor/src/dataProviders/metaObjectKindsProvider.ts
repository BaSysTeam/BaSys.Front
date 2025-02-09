import axios from 'axios';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import MetaObjectKind from '../models/metaObjectKind';
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetaObjectKindsProvider extends BaseProvider {
  constructor() {
    super('/api/constructor/v1/MetaObjectKinds');
  }

  async getCollection(): Promise<ResultWrapper<MetaObjectKind[]>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }

  async getSettingsCollection(): Promise<ResultWrapper<MetaObjectKindSettings[]>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/Settings`));
  }

  async getSettingsItemByName(name: string): Promise<ResultWrapper<MetaObjectKindSettings>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${name}`));
  }

  async insert(settings: MetaObjectKindSettings): Promise<ResultWrapper<MetaObjectKindSettings>> {
    return this.handleRequest(axios.post(this.BASE_URL, settings));
  }

  async createStandard(): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.post(`${this.BASE_URL}/Standard`));
  }

  async update(settings: MetaObjectKindSettings): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.put(this.BASE_URL, settings));
  }

  async delete(uid: string): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${uid}`));
  }
}
