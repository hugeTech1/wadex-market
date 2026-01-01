import type { IPageData } from "../../../types/page";

export interface IUser {
  name: string;
  email: string;
  username: string;
  token?: string;
  password?: string;
  uuid?: string;
}

export interface IAddUserParams {
  uuid: string;
  email: string;
  name: string;
  password: string;
  regDate: string;
  status: string;
  username: string;
}

export interface ISigninUser {
  username: string;
  password: string;
}

export interface IUserPageData extends IPageData {
  site_users_name: string;
  site_users_email: string;
  site_users_username: string;
}

export interface IUserData {
  user: IUser[];
  site_users_uuid: string;
  site_users_email: string;
  site_users_name: string;
  site_users_reg_date: string;
  site_users_status: string;
  site_users_username: string;
  site_users_password: string;
  site_users_old_password?: string;
}