import axios from 'axios';
import FileStorageConfig from '@/models/fileStorageConfig';
import StorageKind from '@/models/storageKind';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class FileStorageProvider extends BaseProvider {
  constructor() {
    super('/api/admin/v1/FileStorageConfig');
  }

  async getFileStorageConfig(): Promise<ResultWrapper<FileStorageConfig>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }

  async updateFileStorageConfig(param: FileStorageConfig): Promise<ResultWrapper<boolean>> {
    return this.handleRequest(axios.put(this.BASE_URL, param));
  }

  async getStorageKinds(): Promise<ResultWrapper<StorageKind[]>> {
    const url = `${this.BASE_URL}/GetStorageKinds`;
    return this.handleRequest(axios.get(url));
  }
}
