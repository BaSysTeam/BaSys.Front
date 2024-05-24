import axios from 'axios';
import UserSettings from '../models/userSettings';
import ResultWrapper from '../models/resultWrapper';

export default class UserSettingsProvider {
  private readonly BASE_URL = 'api/v1/UserSettings';

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
