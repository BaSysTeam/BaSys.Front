import axios from 'axios';
import ResultWrapper from '../models/resultWrapper';

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
        const status = error.response?.status || 500;
        result.message = error.response?.data?.message || error.message;
        result.status = status;

        if (status === 401) {
          console.warn('Login expired. Redirecting to login page.');
          window.location.href = '/Identity/Account/Login'; // Redirect to login page.
        } else if (status === 500) {
          console.error('Server error:', error.response?.data);
        } else if (status === 404) {
          console.error('Not found:', error.config?.url);
        } else {
          console.error('Unknown error.');
        }
      } else {
        result.message = 'Unknown error.';
        result.status = 500;
      }

      return result;
    }
  }
}
