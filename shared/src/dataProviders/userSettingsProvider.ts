import axios from 'axios';
import BaseProvider from './baseProvider';
import ChangePassword from '../models/changePassword';
import UserSettings from '../models/userSettings';
import ResultWrapper from '../models/resultWrapper';
import Language from '../models/language';

export default class UserSettingsProvider extends BaseProvider {
  constructor() {
    super('api/v1/UserSettings');
  }

  async getLanguages(): Promise<ResultWrapper<Language[]>> {
    const url = `${this.BASE_URL}/GetLanguages`;
    return this.handleRequest(axios.get(url));
    // let result: ResultWrapper<Language[]> = new ResultWrapper<Language[]>();
    //
    // try {
    //   const url = `${this.BASE_URL}/GetLanguages`;
    //   const { data } = await axios.get(url);
    //   result = data;
    // } catch (error) {
    //   console.error('error', error);
    // }
    //
    // return result;
  }

  async getUserSettings(): Promise<ResultWrapper<UserSettings>> {
    return this.handleRequest(axios.get(this.BASE_URL));
    // let result: ResultWrapper<UserSettings> = new ResultWrapper<UserSettings>();
    //
    // try {
    //   const { data } = await axios.get(this.BASE_URL);
    //   result = data;
    // } catch (error) {
    //   console.error('error', error);
    // }
    //
    // return result;
  }

  async updateUserSettings(userSettings: UserSettings): Promise<ResultWrapper<boolean>> {
    return this.handleRequest(axios.post(this.BASE_URL, userSettings));
    // let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();
    //
    // try {
    //   const { data } = await axios.post(this.BASE_URL, userSettings);
    //   result = data;
    // } catch (error) {
    //   console.error('error', error);
    // }
    //
    // return result;
  }

  async changePassword(dto: ChangePassword): Promise<ResultWrapper<boolean>> {
    const url = `${this.BASE_URL}/ChangePassword`;
    return this.handleRequest(axios.post(url, dto));
    // let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();
    //
    // try {
    //   const url = `${this.BASE_URL}/ChangePassword`;
    //   const { data } = await axios.post(url, dto);
    //   result = data;
    // } catch (error) {
    //   console.error('error', error);
    // }
    //
    // return result;
  }
}
