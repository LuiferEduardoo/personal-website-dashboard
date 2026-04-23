import { request } from '../../lib/api';
import type { UserRead } from './types';

export function getMe(token: string): Promise<UserRead> {
  return request<UserRead>('/api/v1/users/me', { token });
}
