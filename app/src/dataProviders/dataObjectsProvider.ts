import axios from 'axios';
import DataObject from '@/models/dataObject';
import DataObjectWithMetadata from '@/models/dataObjectWithMetadata';
import DataObjectDetailsTable from '@/models/dataObjectDetailsTable';
import DataObjectSaveDto from '@/models/dataObjectSaveDto';
import DataObjectList from '../models/dataObjectList';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class DataObjectsProvider extends BaseProvider {
  constructor() {
    super('/api/app/v1/DataObjects');
  }

  async getCollection(kind: string, name: string): Promise<ResultWrapper<DataObjectList>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${kind}/${name}`));
  }

  async queryRegistratorRoute(dto: any): Promise<ResultWrapper<DataObjectList>> {
    return this.handleRequest(axios.post(`${this.BASE_URL}/registrator-route`, dto));
  }

  async getItem(kind: string, name: string, uid: string)
    : Promise<ResultWrapper<DataObjectWithMetadata>> {
    let requestUid = uid;
    if (!requestUid) requestUid = '1175f1ae-2630-47ae-8a11-19e75e3f49e0'; // NON existing uid.
    return this.handleRequest(axios.get(`${this.BASE_URL}/${kind}/${name}/${requestUid}`));
  }

  async getDetailsTable(kind: string, name: string, uid: string, tableName: string)
    : Promise<ResultWrapper<DataObjectDetailsTable>> {
    let requestUid = uid;
    if (!requestUid) requestUid = '1175f1ae-2630-47ae-8a11-19e75e3f49e0'; // NON existing uid.
    return this.handleRequest(axios.get(`${this.BASE_URL}/${kind}/${name}/${requestUid}/details/${tableName}`));
  }

  async createItem(
    metaObjectKindUid: string,
    metaObjectUid: string,
    item: DataObject,
    logLevel: number,
  )
    : Promise<ResultWrapper<string>> {
    const payload = new DataObjectSaveDto(
      metaObjectKindUid,
      metaObjectUid,
      item,
      logLevel,
    );

    return this.handleRequest(axios.post(this.BASE_URL, payload));
  }

  async updateItem(
    metaObjectKindUid: string,
    metaObjectUid: string,
    item: DataObject,
    logLevel: number,
  )
    : Promise<ResultWrapper<any[]>> {
    const payload = new DataObjectSaveDto(
      metaObjectKindUid,
      metaObjectUid,
      item,
      logLevel,
    );

    return this.handleRequest(axios.put(this.BASE_URL, payload));
  }

  async deleteItem(kind: string, name: string, uid: string): Promise<ResultWrapper<number>> {
    const url = `${this.BASE_URL}/${kind}/${name}/${uid}`;
    return this.handleRequest(axios.delete(url));
  }
}
