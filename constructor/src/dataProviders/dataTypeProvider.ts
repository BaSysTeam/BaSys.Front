import axios from 'axios';
import BaseProvider from '@/dataProviders/baseProvider';
import DataType from '../../../shared/src/models/dataType';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class DataTypeProvider extends BaseProvider {
  constructor() {
    super('/api/constructor/v1/DataTypes');
  }

  async getDataTypes(): Promise<ResultWrapper<DataType[]>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }
}
