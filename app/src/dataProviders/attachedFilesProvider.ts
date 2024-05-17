import axios from 'axios';
import FileInfo from '@/models/fileInfo';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class AttachedFilesProvider {
  readonly BASE_URL = '/api/v1/AttachedFiles';

  async getFilesList(metaObjectKindUid: string, metaObjectUid: string, objectUid: string)
    : Promise<ResultWrapper<FileInfo[]>> {
    let result: ResultWrapper<FileInfo[]> = new ResultWrapper<FileInfo[]>();

    try {
      const url = `${this.BASE_URL}/GetAttachedFilesList?metaObjectKindUid=${metaObjectKindUid}&metaObjectUid=${metaObjectUid}&objectUid=${objectUid}`;
      const { data } = await axios.get(url);
      result = data;
      if (!result.isOK) {
        console.error(result.presentation);
      }
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async uploadFiles(
    files: FileList,
    metaObjectKindUid: string,
    metaObjectUid: string,
    objectUid: string,
  )
    : Promise<boolean> {
    const url = `${this.BASE_URL}/Upload?metaObjectKindUid=${metaObjectKindUid}&metaObjectUid=${metaObjectUid}&objectUid=${objectUid}`;
    const formData = new FormData();
    for (let i = 0; i < files.length; i += 1) {
      formData.append(`file${i}`, files[i]);
    }
    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return true;
  }

  async deleteFile(metaObjectKindUid: string, fileUid: string): Promise<boolean> {
    let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();

    try {
      const url = `${this.BASE_URL}?metaObjectKindUid=${metaObjectKindUid}&fileUid=${fileUid}`;
      const { data } = await axios.delete(url);
      result = data;
      if (!result.isOK) {
        console.error(result.presentation);
      }
    } catch (error) {
      console.error('error', error);
    }

    return result.data;
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
}
