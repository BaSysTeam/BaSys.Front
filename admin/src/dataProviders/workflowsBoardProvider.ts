import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class WorkflowsBoardProvider {
  private readonly BASE_URL = '/api/admin/v1/WorkflowsBoard';

  async getInfo(): Promise<ResultWrapper<any[]>> {
    let result: ResultWrapper<any[]> = new ResultWrapper<any[]>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
