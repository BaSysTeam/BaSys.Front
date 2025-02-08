import axios from 'axios';
import FileInfo from '@/models/fileInfo';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class AttachedFilesProvider extends BaseProvider {
  constructor() {
    super('/api/v1/AttachedFiles');
  }

  async getFilesList(metaObjectKindUid: string, metaObjectUid: string, objectUid: string)
    : Promise<ResultWrapper<FileInfo[]>> {
    const url = `${this.BASE_URL}/GetAttachedFilesList`;
    return this.handleRequest(axios.get(url, {
      params:
        { metaObjectKindUid, metaObjectUid, objectUid },
    }));
  }

  async deleteFile(metaObjectKindUid: string, fileUid: string): Promise<any> {
    const url = `${this.BASE_URL}?metaObjectKindUid=${metaObjectKindUid}&fileUid=${fileUid}`;
    return this.handleRequest(axios.delete(url));
  }

  async downloadFile(metaObjectKindUid: string, fileUid: string, fileName: string): Promise<void> {
    const url = `${this.BASE_URL}/Download?metaObjectKindUid=${metaObjectKindUid}&fileUid=${fileUid}`;
    await axios.get(url, { responseType: 'blob' })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch(console.error);
  }

  async getImageBase64(fileUid: string): Promise<any> {
    const url = `${this.BASE_URL}/GetImageBase64?fileUid=${fileUid}`;
    return this.handleRequest(axios.get(url));
  }
}
