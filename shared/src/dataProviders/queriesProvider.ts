import axios from 'axios';
import BaseProvider from './baseProvider';
import ResultWrapper from '../models/resultWrapper';
import SelectQueryModel from '../evalEngine/selectQueryModel';

export default class QueriesProvider extends BaseProvider {
  constructor() {
    super('/api/constructor/v1/Queries');
  }

  async execute(queryModel: SelectQueryModel): Promise<ResultWrapper<any>> {
    return this.handleRequest(axios.post(`${this.BASE_URL}/Execute`, queryModel));
    // let result = new ResultWrapper<any>();
    //
    // try {
    //   const { data } = await axios.post(`${this.BASE_URL}/Execute`, queryModel);
    //   console.log('Query executed', data);
    //   result = data;
    // } catch (error) {
    //   console.error('error', error);
    // }
    //
    // return result;
  }
}
