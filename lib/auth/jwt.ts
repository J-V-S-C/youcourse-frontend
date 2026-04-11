import { jwtDecode } from 'jwt-decode';
import type { JWTPayload } from './types';

export function decodeToken(token: string): JWTPayload {
  return jwtDecode<JWTPayload>(token);
}
