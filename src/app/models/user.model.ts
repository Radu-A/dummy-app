export interface UserDataModel {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserStateModel {
  success: boolean;
  data?: UserDataModel;
  error?: any;
}
