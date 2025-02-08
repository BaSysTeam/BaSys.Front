import axios from 'axios';
import BaseProvider from './baseProvider';
import ResultWrapper from '../models/resultWrapper';

export default class AppRecordProvider extends BaseProvider {
  constructor() {
    super('/api/v1/Account');
  }

  async logout(): Promise<ResultWrapper<boolean>> {
    const url = `${this.BASE_URL}/logout`;
    return this.handleRequest(axios.post(url));

    // let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();
    //
    // try {
    //   const url = `${this.BASE_URL}/logout`;
    //   const { data } = await axios.post(url);
    //   result = data;
    //   if (!result.isOK) {
    //     console.error(result.presentation);
    //   }
    // } catch (error) {
    //   console.error('error', error);
    // }
    //
    // return result;
  }

  async currentUserName(): Promise<ResultWrapper<string>> {
    const url = `${this.BASE_URL}/currentUserName`;
    return this.handleRequest(axios.get(url));

    // let result: ResultWrapper<string> = new ResultWrapper<string>();
    //
    // try {
    //   const url = `${this.BASE_URL}/currentUserName`;
    //   const { data } = await axios.get(url);
    //   result = data;
    //   if (!result.isOK) {
    //     console.error(result.presentation);
    //   }
    // } catch (error) {
    //   console.error('error', error);
    // }
    //
    // return result;
  }
}
