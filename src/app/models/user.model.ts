export interface UserDataModel {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UserStateModel {
  success: boolean;
  data?: UserDataModel;
  error?: any;
}

export interface RefreshResponseModel {
  accessToken: string;
  refreshToken: string;
}
