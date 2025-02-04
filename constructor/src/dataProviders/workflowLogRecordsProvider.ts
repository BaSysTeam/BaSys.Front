import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class WorkflowLogRecordsProvider {
  private readonly BASE_URL = '/api/constructor/v1/WorkflowLogRecords';

  async GetWorkflowLifecycleRecords(workflowUid: string): Promise<ResultWrapper<any>> {
    let result: ResultWrapper<any> = new ResultWrapper<any>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/lifecycle/${workflowUid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async GetRecordsByRun(runUid: string): Promise<ResultWrapper<any>> {
    let result: ResultWrapper<any> = new ResultWrapper<any>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/run/${runUid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async delete(workflowUid: string): Promise<ResultWrapper<number>> {
    let result = new ResultWrapper<number>();

    try {
      const { data } = await axios.delete(`${this.BASE_URL}/${workflowUid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
