export type JWTPayload = {
  sub: string;
  exp: number;
};

export type LoginResponseDTO = {
  access_token: string;
  refresh_token: string;
};

export type RefreshResponseDTO = {
  access_token: string;
  refresh_token?: string;
};

export type AuthUser = {
  id: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
};

export type AuthToken = AuthUser & {
  error?: 'RefreshError';
};
