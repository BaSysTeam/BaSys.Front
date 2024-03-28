import axios from 'axios';
import DataType from '../models/dataType';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class DataTypeProvider {
  private readonly BASE_URL = '/api/constructor/v1/DataTypes';

  async getDataTypes(): Promise<ResultWrapper<DataType[]>> {
    let result: ResultWrapper<DataType[]> = new ResultWrapper<DataType[]>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
