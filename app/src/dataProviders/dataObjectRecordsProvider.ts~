import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class DataObjectRecordsProvider {
  readonly BASE_URL = '/api/app/v1/DataObjectRecords';

  async getModelAsync(kind: string, name: string, uid: string): Promise<ResultWrapper<any>> {
    let result: ResultWrapper<any> = new ResultWrapper<any>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/Model/${kind}/${name}/${uid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getRecordsAsync(
    kind: string,
    name: string,
    objectUid: string,
    registerUid: string,
  ): Promise<ResultWrapper<any>> {
    let result: ResultWrapper<any> = new ResultWrapper<any>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/Records/${kind}/${name}/${objectUid}/${registerUid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async createRecordsAsync(kind: string, name: string, uid: string):
    Promise<ResultWrapper<any[]>> {
    let result: ResultWrapper<any[]> = new ResultWrapper<any[]>();

    try {
      const { data } = await axios.post(`${this.BASE_URL}/${kind}/${name}/${uid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async deleteRecordsAsync(kind: string, name: string, uid: string):
    Promise<ResultWrapper<boolean>> {
    let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();

    try {
      const { data } = await axios.delete(`${this.BASE_URL}/${kind}/${name}/${uid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
