import axios from 'axios';
import UserGroup from '@/models/userGroup';
import MetaObjectKind from '@/models/metaObjectKind';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class UserGroupProvider {
  private readonly BASE_URL = '/api/admin/v1/UserGroup';

  async getUserGroups(): Promise<ResultWrapper<UserGroup[]>> {
    let result: ResultWrapper<UserGroup[]> = new ResultWrapper<UserGroup[]>();

    try {
      const { data } = await axios.get(this.BASE_URL);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async deleteUserGroup(userGroupUid: string) : Promise<ResultWrapper<boolean>> {
    let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();

    const url = `${this.BASE_URL}?userGroupUid=${userGroupUid}`;
    try {
      const { data } = await axios.delete(url);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async createUserGroup(userGroup: UserGroup) : Promise<ResultWrapper<boolean>> {
    let result: ResultWrapper<boolean> = new ResultWrapper<boolean>();
    const url = `${this.BASE_URL}/Create`;

    try {
      const { data } = await axios.post(url, userGroup);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getMetaObjectKindItems(): Promise<ResultWrapper<MetaObjectKind[]>> {
    let result: ResultWrapper<MetaObjectKind[]> = new ResultWrapper<MetaObjectKind[]>();
    const url = '/api/constructor/v1/MetaObjectKinds';

    try {
      const { data } = await axios.get(url);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async getUserGroup(userGroupUid: string): Promise<ResultWrapper<UserGroup>> {
    let result: ResultWrapper<UserGroup> = new ResultWrapper<UserGroup>();
    const url = `${this.BASE_URL}/GetUserGroup?userGroupUid=${userGroupUid}`;

    try {
      const { data } = await axios.get(url);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }

  async saveUserGroup(model: UserGroup): Promise<ResultWrapper<UserGroup>> {
    let result: ResultWrapper<UserGroup> = new ResultWrapper<UserGroup>();
    const url = `${this.BASE_URL}/Save`;

    try {
      const { data } = await axios.post(url, model);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
