export default class User {
    id = '';
    userName = '';
    email = '';

    constructor(options: { [key: string]: any }) {
      this.id = options.id;
      this.userName = options.userName;
      this.email = options.email;
    }
}
