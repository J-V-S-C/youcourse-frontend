import { post } from '../http';
import { publicPost } from '../http-public';
import { decodeToken } from './jwt';
import type {
  AuthToken,
  AuthUser,
  LoginResponseDTO,
  RefreshResponseDTO,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function login(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  try {
    const { access_token, refresh_token } = await publicPost<LoginResponseDTO>(
      `${API_BASE_URL}/sessions`,
      { email, password },
    );

    const decoded = decodeToken(access_token);

    return {
      id: decoded.sub,
      accessToken: access_token,
      refreshToken: refresh_token,
      accessTokenExpires: decoded.exp * 1000,
    };
  } catch {
    return null;
  }
}

export async function refreshAccessToken(token: AuthToken): Promise<AuthToken> {
  try {
    const { access_token, refresh_token } = await publicPost<RefreshResponseDTO>(
      `${API_BASE_URL}/sessions/refresh`,
      { refreshToken: token.refreshToken },
    );

    const decoded = decodeToken(access_token);

    return {
      ...token,
      accessToken: access_token,
      refreshToken: refresh_token ?? token.refreshToken,
      accessTokenExpires: decoded.exp * 1000,
      error: undefined,
    };
  } catch {
    return {
      ...token,
      error: 'RefreshError',
    };
  }
}
