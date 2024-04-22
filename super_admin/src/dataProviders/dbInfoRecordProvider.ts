import DbInfoRecord from '@/models/dbInfoRecord';
import axios from 'axios';
import ExistsDbResponse from '@/models/existsDbResponse';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class DbInfoRecordProvider {
  readonly BASE_URL = '/api/sa/v1/DbInfoRecords';

  async getDbInfoRecords(): Promise<ResultWrapper<DbInfoRecord[]>> {
    let result: ResultWrapper<DbInfoRecord[]> = new ResultWrapper<DbInfoRecord[]>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getDbInfoRecordById(id: number): Promise<ResultWrapper<DbInfoRecord>> {
    let result: ResultWrapper<DbInfoRecord> = new ResultWrapper<DbInfoRecord>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${id}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async addDbInfoRecord(dbInfoRecord: DbInfoRecord): Promise<ResultWrapper<DbInfoRecord>> {
    let result: ResultWrapper<DbInfoRecord> = new ResultWrapper<DbInfoRecord>();

    try {
      const { data } = await axios.post(this.BASE_URL, dbInfoRecord);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async updateDbInfoRecord(dbInfoRecord: DbInfoRecord): Promise<ResultWrapper<DbInfoRecord>> {
    let result: ResultWrapper<DbInfoRecord> = new ResultWrapper<DbInfoRecord>();

    try {
      const { data } = await axios.put(this.BASE_URL, dbInfoRecord);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async deleteDbInfoRecord(id: number): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.delete(`${this.BASE_URL}/${id}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async switchActivity(id: number): Promise<ResultWrapper<DbInfoRecord>> {
    let result: ResultWrapper<DbInfoRecord> = new ResultWrapper<DbInfoRecord>();

    try {
      const { data } = await axios.patch(`${this.BASE_URL}/${id}/switchactivity`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async checkDbExists(queryParams: string): Promise<ResultWrapper<ExistsDbResponse[]>> {
    let result: ResultWrapper<ExistsDbResponse[]> = new ResultWrapper<ExistsDbResponse[]>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/CheckDbExists?${queryParams}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
