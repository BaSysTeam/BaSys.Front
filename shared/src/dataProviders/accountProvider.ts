import axios from 'axios';
import ResultWrapper from '../models/resultWrapper';

export default class AppRecordProvider {
    private readonly BASE_URL = '/api/v1/Account';

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

    async currentUserName(): Promise<ResultWrapper<string>> {
      let result: ResultWrapper<string> = new ResultWrapper<string>();

      try {
        const url = `${this.BASE_URL}/currentUserName`;
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
}
