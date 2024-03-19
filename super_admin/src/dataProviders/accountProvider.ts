import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class AppRecordProvider {
    readonly BASE_URL = '/api/sa/v1/Account';

    async logout(): Promise<ResultWrapper<boolean>> {
      let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();

      try {
        const url = `${this.BASE_URL}/logout`;
        const { data } = await axios.post(url);
        result = data;
        if (!result.isOK) {
          console.error(result.presentation);
        }
      } catch (error) {
        console.error('error', error);
      }

      return result;
    }
}
