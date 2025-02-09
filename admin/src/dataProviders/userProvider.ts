import axios from 'axios';
import User from '../models/user';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class UserProvider extends BaseProvider {
  constructor() {
    super('/api/admin/v1/Users');
  }

  async getAllUsers(): Promise<ResultWrapper<User[]>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }

  async getUser(id: string): Promise<ResultWrapper<User>> {
    return this.handleRequest(axios.get(`${this.BASE_URL}/${id}`));
  }

  async createUser(user: User): Promise<ResultWrapper<User>> {
    return this.handleRequest(axios.post(this.BASE_URL, user));
  }

  async updateUser(user: User): Promise<ResultWrapper<User>> {
    return this.handleRequest(axios.put(this.BASE_URL, user));
  }

  async deleteUser(id: string): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.delete(`${this.BASE_URL}/${id}`));
  }

  async disableUser(id: string): Promise<ResultWrapper<string>> {
    return this.handleRequest(axios.patch(`${this.BASE_URL}/${id}/disable`));
  }

  async enableUser(id: string): Promise<ResultWrapper<string>> {
    return this.handleRequest(axios.patch(`${this.BASE_URL}/${id}/enable`));
  }

  async changePassword(id: string, newPassword: string): Promise<ResultWrapper<number>> {
    return this.handleRequest(axios.patch(`${this.BASE_URL}/${id}/password`, {
      newPassword,
    }));
  }
}
