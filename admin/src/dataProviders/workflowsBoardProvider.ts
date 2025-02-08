import axios from 'axios';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class WorkflowsBoardProvider extends BaseProvider {
  constructor() {
    super('/api/admin/v1/WorkflowsBoard');
  }

  async getInfo(): Promise<ResultWrapper<any[]>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }

  async terminateAsync(runUid: string):
    Promise<ResultWrapper<boolean>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${runUid}`));
  }
}
