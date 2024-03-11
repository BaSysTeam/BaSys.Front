import axios from 'axios';
import User from '../models/user';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class UserDataprovider {
    readonly BASE_URL = '/api/admin/v1/Users';

    async getAllUsers(): Promise<ResultWrapper<User[]>> {
      let result: ResultWrapper<User[]> = new ResultWrapper<User[]>();

      try {
        const { data } = await axios.get(this.BASE_URL);
        result = data;
      } catch (error) {
        console.error('error', error);
      }

      return result;
    }

    async getUser(id: string): Promise<ResultWrapper<User>> {
      let result: ResultWrapper<User> = new ResultWrapper<User>();

      try {
        const { data } = await axios.get(`${this.BASE_URL}/${id}`);
        result = data;
      } catch (error) {
        console.error('error', error);
      }

      return result;
    }

    async createUser(user: User): Promise<ResultWrapper<User>> {
      let result: ResultWrapper<User> = new ResultWrapper<User>();

      try {
        const { data } = await axios.post(this.BASE_URL, user);
        result = data;
      } catch (error) {
        console.error('error', error);
      }

      return result;
    }

    async updateUser(user: User): Promise<ResultWrapper<User>> {
      let result: ResultWrapper<User> = new ResultWrapper<User>();

      try {
        const { data } = await axios.put(this.BASE_URL, user);
        result = data;
      } catch (error) {
        console.error('error', error);
      }

      return result;
    }

    async deleteUser(id: string): Promise<ResultWrapper<number>> {
      let result: ResultWrapper<number> = new ResultWrapper<number>();

      try {
        const { data } = await axios.delete(`${this.BASE_URL}/${id}`);
        result = data;
      } catch (error) {
        console.error('error', error);
      }

      return result;
    }

    async disableUser(id: string): Promise<ResultWrapper<string>> {
      let result: ResultWrapper<string> = new ResultWrapper<string>();

      try {
        const { data } = await axios.patch(`${this.BASE_URL}/${id}/disable`);
        result = data;
      } catch (error) {
        console.error('error', error);
      }

      return result;
    }

    async enableUser(id: string): Promise<ResultWrapper<string>> {
      let result: ResultWrapper<string> = new ResultWrapper<string>();

      try {
        const { data } = await axios.patch(`${this.BASE_URL}/${id}/enable`);
        result = data;
      } catch (error) {
        console.error('error', error);
      }

      return result;
    }
}
