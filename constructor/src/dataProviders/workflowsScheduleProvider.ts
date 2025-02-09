import axios from 'axios';
import WorkflowScheduleRecord from '@/models/workflowScheduleRecord';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class WorkflowScheduleProvider extends BaseProvider {
  constructor() {
    super('/api/constructor/v1/WorkflowsSchedule');
  }

  async getWorkflowRecords(workflowUid: string): Promise<ResultWrapper<WorkflowScheduleRecord[]>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/?workflowUid=${workflowUid}`));
  }

  async getItem(uid: string): Promise<ResultWrapper<WorkflowScheduleRecord>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${uid}`));
  }

  async create(record: WorkflowScheduleRecord): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.post(this.BASE_URL, record));
  }

  async update(record: WorkflowScheduleRecord): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.put(this.BASE_URL, record));
  }

  async delete(uid: string): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${uid}`));
  }
}
