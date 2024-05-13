import axios from 'axios';
import FileStorageConfig from '@/models/fileStorageConfig';
import StorageKind from '@/models/storageKind';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class FileStorageProvider {
  private readonly BASE_URL = '/api/admin/v1/FileStorageConfig';

  async getFileStorageConfig(): Promise<ResultWrapper<FileStorageConfig>> {
    let result: ResultWrapper<FileStorageConfig> = new ResultWrapper<FileStorageConfig>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async updateFileStorageConfig(param: FileStorageConfig): Promise<ResultWrapper<boolean>> {
    let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();

    try {
      const { data } = await axios.put(this.BASE_URL, param);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getStorageKinds(): Promise<ResultWrapper<StorageKind[]>> {
    let result: ResultWrapper<StorageKind[]> = new ResultWrapper<StorageKind[]>();

    try {
      const url = `${this.BASE_URL}/GetStorageKinds`;
      const { data } = await axios.get(url);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
