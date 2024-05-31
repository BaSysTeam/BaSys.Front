import UserGroupUser from '@/models/userGroupUser';
import UserGroupRole from '@/models/userGroupRole';
import UserGroupRight from '@/models/userGroupRight';
import { Guid } from 'guid-typescript';

export default class UserGroup {
  uid = '';
  name = '';
  memo = '';
  isDelete!: boolean;
  createDate!: Date;
  users!: UserGroupUser[]
  roles!: UserGroupRole[]
  globalRights!: UserGroupRight[]
  rights!: UserGroupRight[]

  constructor() {
    this.uid = Guid.EMPTY;
    this.users = [] as UserGroupUser[];
    this.roles = [] as UserGroupRole[];
    this.globalRights = [] as UserGroupRight[];
    this.rights = [] as UserGroupRight[];
    this.isDelete = false;
    this.createDate = new Date();
  }
}
