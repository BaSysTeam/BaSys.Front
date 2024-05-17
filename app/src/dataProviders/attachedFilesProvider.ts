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
}
