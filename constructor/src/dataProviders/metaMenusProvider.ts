import axios from 'axios';
import MenuSettings from '../../../shared/src/models/menuModel/menuSettings';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetaMenusProvider {
  private readonly BASE_URL = '/api/constructor/v1/MetaMenus';

  async getItem(name: string): Promise<ResultWrapper<MenuSettings>> {
    let result: ResultWrapper<MenuSettings> = new ResultWrapper<MenuSettings>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${name}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async create(settings: MenuSettings): Promise<ResultWrapper<number>> {
    let result = new ResultWrapper<number>();

    try {
      const { data } = await axios.post(this.BASE_URL, settings);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async update(settings: MenuSettings): Promise<ResultWrapper<number>> {
    let result = new ResultWrapper<number>();

    try {
      const { data } = await axios.put(this.BASE_URL, settings);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async delete(name: string): Promise<ResultWrapper<number>> {
    let result = new ResultWrapper<number>();

    try {
      const { data } = await axios.delete(`${this.BASE_URL}/${name}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
