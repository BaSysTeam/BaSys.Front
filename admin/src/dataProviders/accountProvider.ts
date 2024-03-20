import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';
import User from '../models/user';

export default class AppRecordProvider {
    readonly BASE_URL = '/api/v1/Account';

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

    async currentUser(): Promise<ResultWrapper<User>> {
      let result: ResultWrapper<User> = new ResultWrapper<User>();

      try {
        const url = `${this.BASE_URL}/currentUser`;
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
