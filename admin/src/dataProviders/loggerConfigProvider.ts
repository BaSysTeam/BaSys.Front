import axios from 'axios';
import LoggerConfig from '@/models/loggerConfig';
import { LoggerKinds } from '@/enums/loggerKinds';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class LoggerConfigProvider extends BaseProvider {
  constructor() {
    super('/api/admin/v1/LoggerConfig');
  }

  async getLoggerConfig(): Promise<ResultWrapper<LoggerConfig>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }

  async getLoggerConfigByType(type: LoggerKinds): Promise<ResultWrapper<LoggerConfig>> {
    const url = `${this.BASE_URL}/GetLoggerConfigByType?loggerType=${type}`;
    return this.handleRequest(axios.get(url));
  }

  async updateLoggerConfig(param: LoggerConfig): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.put(this.BASE_URL, param));
  }
}
