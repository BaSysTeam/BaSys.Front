import AppRecord from '@/models/appRecord';
import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class AppRecordProvider {
  readonly BASE_URL = '/api/sa/v1/AppRecords';

  async getAppRecords(): Promise<ResultWrapper<AppRecord[]>> {
    let result: ResultWrapper<AppRecord[]> = new ResultWrapper<AppRecord[]>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getAppRecordById(id: string): Promise<ResultWrapper<AppRecord>> {
    let result: ResultWrapper<AppRecord> = new ResultWrapper<AppRecord>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${id}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async addAppRecord(appRecord: AppRecord): Promise<ResultWrapper<AppRecord>> {
    let result: ResultWrapper<AppRecord> = new ResultWrapper<AppRecord>();

    try {
      const { data } = await axios.post(this.BASE_URL, appRecord);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async updateAppRecord(appRecord: AppRecord): Promise<ResultWrapper<AppRecord>> {
    let result: ResultWrapper<AppRecord> = new ResultWrapper<AppRecord>();

    try {
      const { data } = await axios.put(this.BASE_URL, appRecord);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async deleteAppRecord(id: string): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.delete(`${this.BASE_URL}/${id}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
