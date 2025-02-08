import axios from 'axios';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class WorkflowsProvider extends BaseProvider {
  constructor() {
    super('/api/app/v1/Workflows');
  }

  async startAsync(startDto: any):
    Promise<ResultWrapper<any>> {
    return this.handleRequest(axios.post(`${this.BASE_URL}/start`, startDto));
  }

  async checkAsync(runUid: string):
    Promise<ResultWrapper<any>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/check/${runUid}`));
  }

  async terminateAsync(runUid: string):
    Promise<ResultWrapper<boolean>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${runUid}`));
  }
}
