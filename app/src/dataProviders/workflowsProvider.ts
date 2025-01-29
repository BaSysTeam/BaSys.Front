import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class WorkflowsProvider {
  private readonly BASE_URL = '/api/app/v1/Workflows';

  async startAsync(startDto: any):
    Promise<ResultWrapper<any>> {
    let result: ResultWrapper<any> = new ResultWrapper<any>();

    try {
      const { data } = await axios.post(`${this.BASE_URL}/start`, startDto);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async checkAsync(runUid: string):
    Promise<ResultWrapper<any>> {
    let result: ResultWrapper<any> = new ResultWrapper<any>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/check/${runUid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async terminateAsync(runUid: string):
    Promise<ResultWrapper<any>> {
    let result: ResultWrapper<any> = new ResultWrapper<any>();

    try {
      const { data } = await axios.delete(`${this.BASE_URL}/${runUid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
