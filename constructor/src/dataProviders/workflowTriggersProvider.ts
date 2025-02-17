import axios from 'axios';
import WorkflowTrigger from '@/models/workflowTrigger';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class WorkflowTriggersProvider extends BaseProvider {
  constructor() {
    super('/api/constructor/v1/WorkflowTriggers');
  }

  async getObjectTriggers(metaObjectUid: string): Promise<ResultWrapper<WorkflowTrigger[]>> {
    const url = `${this.BASE_URL}/?metaObjectUid=${metaObjectUid}`;
    return this.handleRequest(axios.get(url));
  }

  async getWorkflowTriggers(workflowUid: string): Promise<ResultWrapper<WorkflowTrigger[]>> {
    const url = `${this.BASE_URL}/?workflowUid=${workflowUid}`;
    return this.handleRequest(axios.get(url));
  }

  async getItem(uid: string): Promise<ResultWrapper<WorkflowTrigger>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${uid}`));
  }

  async create(item: WorkflowTrigger): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.post(this.BASE_URL, item));
  }

  async update(item: WorkflowTrigger): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.put(this.BASE_URL, item));
  }

  async delete(uid: string): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${uid}`));
  }
}
