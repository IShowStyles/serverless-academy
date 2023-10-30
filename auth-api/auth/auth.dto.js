export class AuthDTO {
  error = [];

  constructor({username, password, email}) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.validate();
  }

  validate() {
    if (!this.username || typeof this.username !== 'string') {
      this.error.push('Empty username');
    }

    if (!this.password || typeof this.password !== 'string') {
      this.error.push('Empty password');
    }

    if (!this.email || typeof this.email !== 'string') {
      this.error.push('Empty email');
    }
  }
}