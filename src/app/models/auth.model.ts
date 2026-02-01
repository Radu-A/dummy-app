import { UserDataModel } from './user.model';

export interface SessionModel {
  success: boolean | undefined;
  data?: UserDataModel;
  error?: string | null;
}

export interface RefreshResponseModel {
  accessToken: string;
  refreshToken: string;
}
