import { request } from '../../lib/api';
import type { UserRead, UserUpdateMe } from './types';

export function getMe(token: string): Promise<UserRead> {
  return request<UserRead>('/api/v1/users/me', { token });
}

export function updateMe(token: string, payload: UserUpdateMe): Promise<UserRead> {
  return request<UserRead>('/api/v1/users/me', {
    method: 'PATCH',
    token,
    body: payload,
  });
}

export function updateProfilePhoto(token: string, file: File): Promise<UserRead> {
  const formData = new FormData();
  formData.append('file', file);
  
  return request<UserRead>('/api/v1/users/me/profile-photo', {
    method: 'PATCH',
    token,
    body: formData,
  });
}
