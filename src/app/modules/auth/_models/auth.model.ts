export class AuthModel {

  uniqid: string;
  token: string;
  created_at: string;

  // accessToken: string;
  // refreshToken: string;
  // expiresIn: Date;

  setAuth(auth: any) {
    // this.id = auth.user_id;
    //
    // this.user_type = auth.user_type;
    // this.username = auth.username;
    // this.full_name = auth.full_name;
    // this.primary_email = auth.primary_email;
    // this.primary_mobile = auth.primary_mobile;
    // this.account_code = auth.account_code;
    // this.verified = auth.verified;
    //
    // this.status = auth.status;
    // this.roles = auth.roles;
    // this.photo_url = auth.photo_url;
    // this.details.first_name = auth.details.first_name;
    // this.details.last_name = auth.details.last_name;
    // this.details.avatar_url = auth.details.avatar_url;
    this.uniqid = auth.uniqid;
    this.token = auth.token;
    // this.created_at = auth.created_at;
  }
}
