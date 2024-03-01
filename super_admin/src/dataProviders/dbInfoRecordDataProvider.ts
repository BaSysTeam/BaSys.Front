import DbInfoRecord from '@/models/dbInfoRecord';
import ResultWrapper from '@/models/resultWrapper';
import axios from 'axios';

export default class DbInfoRecordService {
  readonly BASE_URL = '/api/sa/v1/DbInfoRecords';

  async getDbInfoRecords(): Promise<ResultWrapper<DbInfoRecord[]>> {
    let result: ResultWrapper<DbInfoRecord[]> = new ResultWrapper<DbInfoRecord[]>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.log('error', error);
    }

    return result;
  }

  async getDbInfoRecordById(id: number): Promise<ResultWrapper<DbInfoRecord>> {
    let result: ResultWrapper<DbInfoRecord> = new ResultWrapper<DbInfoRecord>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${id}`);
      result = data;
    } catch (error) {
      console.log('error', error);
    }

    return result;
  }

  async addDbInfoRecord(dbInfoRecord: DbInfoRecord): Promise<ResultWrapper<DbInfoRecord>> {
    let result: ResultWrapper<DbInfoRecord> = new ResultWrapper<DbInfoRecord>();

    try {
      const { data } = await axios.post(this.BASE_URL, dbInfoRecord);
      result = data;
    } catch (error) {
      console.log('error', error);
    }

    return result;
  }

  async updateDbInfoRecord(dbInfoRecord: DbInfoRecord): Promise<ResultWrapper<DbInfoRecord>> {
    let result: ResultWrapper<DbInfoRecord> = new ResultWrapper<DbInfoRecord>();

    try {
      const { data } = await axios.put(this.BASE_URL, dbInfoRecord);
      result = data;
    } catch (error) {
      console.log('error', error);
    }

    return result;
  }

  async deleteDbInfoRecord(id: number): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.delete(`${this.BASE_URL}/${id}`);
      result = data;
    } catch (error) {
      console.log('error', error);
    }

    return result;
  }
}
