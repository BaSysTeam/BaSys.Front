import UserRole from './userRole';

export default class User {
    id = '';
    userName = '';
    email = '';
    password = '';
    isActive = false;
    roles:UserRole[] = [];

    constructor(options: { [key: string]: any }) {
      this.id = options.id;
      this.userName = options.userName;
      this.email = options.email;
      this.password = options.password;
      this.isActive = options.isActive;
      this.roles = options.roles;
    }
}
