import axios from 'axios';
import BaseProvider from '@/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class WorkflowLogRecordsProvider extends BaseProvider {
  constructor() {
    super('/api/constructor/v1/WorkflowLogRecords');
  }

  async getWorkflowLifecycleRecords(workflowUid: string): Promise<ResultWrapper<any>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/lifecycle/${workflowUid}`));
  }

  async getRecordsByRun(runUid: string): Promise<ResultWrapper<any>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/run/${runUid}`));
  }

  async delete(workflowUid: string): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${workflowUid}`));
  }
}
