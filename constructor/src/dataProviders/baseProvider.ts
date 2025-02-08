import axios from 'axios';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default abstract class BaseProvider {
  protected readonly BASE_URL: string;

  protected constructor(baseUrl: string) {
    this.BASE_URL = baseUrl || process.env.API_BASE_URL || '';
  }

  /**
   * Generic method to handle API requests.
   */
  protected async handleRequest<T>(apiCall: Promise<{ data: ResultWrapper<T> }>):
    Promise<ResultWrapper<T>> {
    try {
      const { data } = await apiCall;
      return data;
    } catch (error) {
      console.error('API Request Failed:', error);

      const result = new ResultWrapper<T>();
      result.isOK = false;
      if (axios.isAxiosError(error)) {
        result.message = error.response?.data?.message || error.message;
        result.status = error.response?.status || 500;
      } else {
        result.message = 'Unexpected error occurred.';
        result.status = 500;
      }

      return result;
    }
  }
}
