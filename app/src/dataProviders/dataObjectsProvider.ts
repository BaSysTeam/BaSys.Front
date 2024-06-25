import axios from 'axios';
import DataObject from '@/models/dataObject';
import DataObjectWithMetadata from '@/models/dataObjectWithMetadata';
import DataObjectList from '../models/dataObjectList';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class DataObjectsProvider {
  private readonly BASE_URL = '/api/app/v1/DataObjects';

  async getCollection(kind: string, name: string): Promise<ResultWrapper<DataObjectList>> {
    let result: ResultWrapper<DataObjectList> = new ResultWrapper<DataObjectList>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${kind}/${name}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getItem(kind: string, name: string, uid: string)
    : Promise<ResultWrapper<DataObjectWithMetadata>> {
    let result: ResultWrapper<DataObjectWithMetadata> = new ResultWrapper<DataObjectWithMetadata>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/${kind}/${name}/${uid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
