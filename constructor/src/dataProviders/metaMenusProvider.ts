import axios from 'axios';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import MenuSettings from '../../../shared/src/models/menuModel/menuSettings';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetaMenusProvider extends BaseProvider {
  constructor() {
    super('/api/constructor/v1/MetaMenus');
  }

  async getItem(name: string): Promise<ResultWrapper<MenuSettings>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${name}`));
  }

  async create(settings: MenuSettings): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.post(this.BASE_URL, settings));
  }

  async update(settings: MenuSettings): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.put(this.BASE_URL, settings));
  }

  async delete(name: string): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${name}`));
  }
}
