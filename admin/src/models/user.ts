import UserRole from './userRole';

export default class User {
    id = '';
    userName = '';
    email = '';
    password = '';
    isActive = false;
    roles:UserRole[] = [];
}
