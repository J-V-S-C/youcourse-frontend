import { get, post } from '../http';
import { decodeToken } from '../auth/jwt';
import type {
  GetUserProfileResponse,
  RegisterRequestDTO,
  ChangePasswordDTO,
  UserProfileDTO,
} from './types';
import { publicPost } from '../http-public';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getUserProfile(
  accessToken: string,
): Promise<UserProfileDTO | null> {
  try {
    const decoded = decodeToken(accessToken);
    const userId = decoded.sub;

    const response = await get<GetUserProfileResponse>(
      `${API_BASE_URL}/accounts/${userId}`,
     
    );

    return response.account;
  } catch {
    return null;
  }
}

export async function register(data: RegisterRequestDTO): Promise<void> {
  await publicPost(`${API_BASE_URL}/accounts`, data);
}

export async function requestPasswordReset(email: string): Promise<void> {
 await publicPost(`${API_BASE_URL}/accounts/password-reset`, { email });
}

export async function changePassword(data: ChangePasswordDTO): Promise<void> {
  await publicPost(`${API_BASE_URL}/accounts/password`, data);
}
