import DbInfoRecord from '@/models/dbInfoRecord';
import axios from 'axios';
import ExistsDbResponse from '@/models/existsDbResponse';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class DbInfoRecordProvider extends BaseProvider {
  constructor() {
    super('/api/sa/v1/DbInfoRecords');
  }

  async getDbInfoRecords(): Promise<ResultWrapper<DbInfoRecord[]>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }

  async getDbInfoRecordById(id: number): Promise<ResultWrapper<DbInfoRecord>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${id}`));
  }

  async addDbInfoRecord(dbInfoRecord: DbInfoRecord): Promise<ResultWrapper<DbInfoRecord>> {
    return this.handleRequest(axios.post(this.BASE_URL, dbInfoRecord));
  }

  async updateDbInfoRecord(dbInfoRecord: DbInfoRecord): Promise<ResultWrapper<DbInfoRecord>> {
    return this.handleRequest(axios.put(this.BASE_URL, dbInfoRecord));
  }

  async deleteDbInfoRecord(id: number): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${id}`));
  }

  async switchActivity(id: number): Promise<ResultWrapper<DbInfoRecord>> {
    return this.handleRequest(axios.patch(`${this.BASE_URL}/${id}/switchactivity`));
  }

  async checkDbExists(queryParams: string): Promise<ResultWrapper<ExistsDbResponse[]>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/CheckDbExists?${queryParams}`));
  }
}
