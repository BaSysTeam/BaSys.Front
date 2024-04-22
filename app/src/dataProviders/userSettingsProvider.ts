import axios from 'axios';
import UserSettings from '@/models/userSettings';
import Language from '@/models/language';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class UserSettingsProvider {
  private readonly BASE_URL = 'api/v1/UserSettings';

  async getLanguages(): Promise<ResultWrapper<Language[]>> {
    let result: ResultWrapper<Language[]> = new ResultWrapper<Language[]>();

    try {
      const url = `${this.BASE_URL}/GetLanguages`;
      const { data } = await axios.get(url);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getUserSettings(): Promise<ResultWrapper<UserSettings>> {
    let result: ResultWrapper<UserSettings> = new ResultWrapper<UserSettings>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
