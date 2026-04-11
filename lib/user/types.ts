export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DISABLED';

export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  status: AccountStatus;
  createdAt: string;
  lastLogin: string | null;
}

export interface GetUserProfileResponse {
  account: UserProfileDTO;
}

export interface RegisterRequestDTO {
  name: string;
  email: string;
  password: string;
}
