import axios from 'axios';
import LoggerConfig from '@/models/loggerConfig';
import { LoggerKinds } from '@/enums/loggerKinds';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class LoggerConfigProvider {
  private readonly BASE_URL = '/api/admin/v1/LoggerConfig';

  async getLoggerConfig(): Promise<ResultWrapper<LoggerConfig>> {
    let result: ResultWrapper<LoggerConfig> = new ResultWrapper<LoggerConfig>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getLoggerConfigByType(type: LoggerKinds): Promise<ResultWrapper<LoggerConfig>> {
    let result: ResultWrapper<LoggerConfig> = new ResultWrapper<LoggerConfig>();

    try {
      const url = `${this.BASE_URL}/GetLoggerConfigByType?loggerType=${type}`;
      console.log(url);
      const { data } = await axios.get(url);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async updateLoggerConfig(param: LoggerConfig): Promise<ResultWrapper<number>> {
    let result: ResultWrapper<number> = new ResultWrapper<number>();

    try {
      const { data } = await axios.put(this.BASE_URL, param);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
