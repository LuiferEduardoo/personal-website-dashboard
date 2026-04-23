import { request } from '../../lib/api';
import type { ImageRead } from './types';

export function uploadImage(
  file: File,
  token: string,
  folder?: string,
): Promise<ImageRead> {
  const body = new FormData();
  body.append('file', file);
  if (folder) body.append('folder', folder);

  return request<ImageRead>('/api/v1/images', {
    method: 'POST',
    body,
    token,
  });
}

export function deleteImage(imageId: number, token: string): Promise<null> {
  return request<null>(`/api/v1/images/${imageId}`, {
    method: 'DELETE',
    token,
  });
}
