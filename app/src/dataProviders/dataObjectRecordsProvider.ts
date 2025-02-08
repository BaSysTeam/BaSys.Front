import axios from 'axios';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class DataObjectRecordsProvider extends BaseProvider {
  constructor() {
    super('/api/app/v1/DataObjectRecords');
  }

  async getModelAsync(kind: string, name: string, uid: string): Promise<ResultWrapper<any>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/Model/${kind}/${name}/${uid}`));
  }

  async getRecordsAsync(
    kind: string,
    name: string,
    objectUid: string,
    registerUid: string,
  ): Promise<ResultWrapper<any>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/Records/${kind}/${name}/${objectUid}/${registerUid}`));
  }

  async createRecordsAsync(kind: string, name: string, uid: string, logLevel: number):
    Promise<ResultWrapper<any[]>> {
    return this.handleRequest(axios.post(`${this.BASE_URL}/${kind}/${name}/${uid}?logLevel=${logLevel}`));
  }

  async deleteRecordsAsync(kind: string, name: string, uid: string):
    Promise<ResultWrapper<boolean>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${kind}/${name}/${uid}`));
  }
}
