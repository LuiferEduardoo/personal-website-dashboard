import { request } from '../../lib/api';
import type { LoginRequest, PasswordChangeRequest, TokenResponse } from './types';

export function login(payload: LoginRequest): Promise<TokenResponse> {
  return request<TokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function changePassword(token: string, payload: PasswordChangeRequest): Promise<{ message: string }> {
  return request<{ message: string }>('/api/v1/auth/change-password', {
    method: 'POST',
    body: payload,
    token,
  });
}
