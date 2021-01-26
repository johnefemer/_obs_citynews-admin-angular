import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {

  id: number;
  user_type: string;
  username: string;
  password: string;
  full_name: string;
  primary_email: string;
  primary_mobile: string;
  account_code: string;
  verified: number;
  status: string;
  roles: string[];
  photo_url: string;
  pic: string;

  details: {
    first_name: string;
    last_name: string;
    avatar_url: string;
    website: string;
    company_name: string;
    timezone: string;
    language: string;
  };

  address?: AddressModel;
  socialNetworks?: SocialNetworksModel;

  // personal information
  // firstname: string;
  // lastname: string;
  // website: string;
  // account information
  // language: string;
  // timeZone: string;

  communication: {
    email: boolean,
    sms: boolean,
    phone: boolean
  };

  // email settings
  emailSettings: {
    emailNotification: boolean,
    sendCopyToPersonalEmail: boolean,
    activityRelatesEmail: {
      youHaveNewNotifications: boolean,
      youAreSentADirectMessage: boolean,
      someoneAddsYouAsAsAConnection: boolean,
      uponNewOrder: boolean,
      newMembershipApproval: boolean,
      memberRegistration: boolean
    },
    updatesFromKeenthemes: {
      newsAboutKeenthemesProductsAndFeatureUpdates: boolean,
      tipsOnGettingMoreOutOfKeen: boolean,
      thingsYouMissedSindeYouLastLoggedIntoKeen: boolean,
      newsAboutMetronicOnPartnerProductsAndOtherServices: boolean,
      tipsOnMetronicBusinessProducts: boolean
    }
  };

  setUser(user: any) {

    this.id = user.id;
    this.user_type = user.user_type;
    this.username = user.username;
    this.full_name = user.full_name;
    this.primary_email = user.primary_email;
    this.primary_mobile = user.primary_mobile;
    this.account_code = user.account_code;
    this.verified = user.verified;

    this.status = user.status;
    this.roles = user.roles;
    this.photo_url = user.photo_url;
    this.details.first_name = user.details.first_name;
    this.details.last_name = user.details.last_name;
    this.details.avatar_url = user.details.avatar_url;
    this.pic = user.details.avatar_url;

    // this.id = user.id;
    // this.user user.id;
    // this.username = user.username || '';
    // this.full_name = user.fullname || '';
    // this.email = user.email || '';
    // this.pic = user.pic || './assets/media/users/default.jpg';
    // this.roles = user.roles || [];
    // this.occupation = user.occupation || '';
    // this.companyName = user.companyName || '';
    // this.phone = user.phone || '';
    // this.address = user.address;
    // this.socialNetworks = user.socialNetworks;
  }
}
