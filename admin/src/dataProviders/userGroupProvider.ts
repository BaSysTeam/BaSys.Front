import axios from 'axios';
import UserGroup from '@/models/userGroup';
import MetaObjectKind from '@/models/metaObjectKind';
import BaseProvider from '../../../shared/src/dataProviders/baseProvider';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

export default class UserGroupProvider extends BaseProvider {
  constructor() {
    super('/api/admin/v1/UserGroup');
  }

  async getUserGroups(): Promise<ResultWrapper<UserGroup[]>> {
    return this.handleRequest(axios.get(this.BASE_URL));
  }

  async deleteUserGroup(userGroupUid: string) : Promise<ResultWrapper<boolean>> {
    const url = `${this.BASE_URL}?userGroupUid=${userGroupUid}`;
    return this.handleRequest(axios.delete(url));
  }

  async createUserGroup(userGroup: UserGroup) : Promise<ResultWrapper<boolean>> {
    const url = `${this.BASE_URL}/Create`;
    return this.handleRequest(axios.post(url, userGroup));
  }

  async getMetaObjectKindItems(): Promise<ResultWrapper<MetaObjectKind[]>> {
    const url = '/api/constructor/v1/MetaObjectKinds';
    return this.handleRequest(axios.get(url));
  }

  async getUserGroup(userGroupUid: string): Promise<ResultWrapper<UserGroup>> {
    const url = `${this.BASE_URL}/GetUserGroup?userGroupUid=${userGroupUid}`;
    return this.handleRequest(axios.get(url));
  }

  async saveUserGroup(model: UserGroup): Promise<ResultWrapper<UserGroup>> {
    const url = `${this.BASE_URL}/Save`;
    return this.handleRequest(axios.post(url, model));
  }
}
