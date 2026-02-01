export interface UserDataModel {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UserStateModel {
  success: boolean | undefined;
  data?: UserDataModel;
  error?: any;
}

export interface RefreshResponseModel {
  accessToken: string;
  refreshToken: string;
}
