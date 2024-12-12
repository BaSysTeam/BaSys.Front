import axios from 'axios';
import DataObject from '@/models/dataObject';
import DataObjectWithMetadata from '@/models/dataObjectWithMetadata';
import DataObjectDetailsTable from '@/models/dataObjectDetailsTable';
import DataObjectSaveDto from '@/models/dataObjectSaveDto';
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

    let requestUid = uid;
    if (!requestUid) requestUid = '1175f1ae-2630-47ae-8a11-19e75e3f49e0'; // NON existing uid.
    try {
      const { data } = await axios.get(`${this.BASE_URL}/${kind}/${name}/${requestUid}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getDetailsTable(kind: string, name: string, uid: string, tableName: string)
    : Promise<ResultWrapper<DataObjectDetailsTable>> {
    let result: ResultWrapper<DataObjectDetailsTable> = new ResultWrapper<DataObjectDetailsTable>();

    let requestUid = uid;
    if (!requestUid) requestUid = '1175f1ae-2630-47ae-8a11-19e75e3f49e0'; // NON existing uid.
    try {
      const { data } = await axios.get(`${this.BASE_URL}/${kind}/${name}/${requestUid}/details/${tableName}`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async createItem(metaObjectKindUid: string, metaObjectUid: string, item: DataObject)
    : Promise<ResultWrapper<string>> {
    let result: ResultWrapper<string> = new ResultWrapper<string>();

    try {
      const payload = new DataObjectSaveDto(metaObjectKindUid, metaObjectUid, item);
      const { data } = await axios.post(this.BASE_URL, payload);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async updateItem(metaObjectKindUid: string, metaObjectUid: string, item: DataObject)
    : Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const payload = new DataObjectSaveDto(metaObjectKindUid, metaObjectUid, item);
      const { data } = await axios.put(this.BASE_URL, payload);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async deleteItem(kind: string, name: string, uid: string): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const url = `${this.BASE_URL}/${kind}/${name}/${uid}`;
      const { data } = await axios.delete(url);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
