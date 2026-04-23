import { request } from '../../lib/api';
import type { LoginRequest, TokenResponse } from './types';

export function login(payload: LoginRequest): Promise<TokenResponse> {
  return request<TokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
  });
}
