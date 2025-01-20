import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class MetaMenusProvider {
  private readonly BASE_URL = '/api/constructor/v1/MetaWorkflows';

  async getItem(name: string): Promise<ResultWrapper<any>> {
    let result: ResultWrapper<any> = new ResultWrapper<any>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${name}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async create(settings: any): Promise<ResultWrapper<number>> {
    let result = new ResultWrapper<number>();

    try {
      const { data } = await axios.post(this.BASE_URL, settings);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async update(settings: any): Promise<ResultWrapper<number>> {
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
