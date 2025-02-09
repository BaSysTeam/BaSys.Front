import AppRecord from '@/models/appRecord';
import axios from 'axios';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class AppRecordProvider extends BaseProvider {
  constructor() {
    super('/api/sa/v1/AppRecords');
  }

  async getAppRecords(): Promise<ResultWrapper<AppRecord[]>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }

  async getAppRecordById(id: string): Promise<ResultWrapper<AppRecord>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${id}`));
  }

  async addAppRecord(appRecord: AppRecord): Promise<ResultWrapper<AppRecord>> {
    return this.handleRequest(axios.post(this.BASE_URL, appRecord));
  }

  async updateAppRecord(appRecord: AppRecord): Promise<ResultWrapper<AppRecord>> {
    return this.handleRequest(axios.put(this.BASE_URL, appRecord));
  }

  async deleteAppRecord(id: string): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${id}`));
  }
}
