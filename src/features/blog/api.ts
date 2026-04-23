import { request } from '../../lib/api';
import type {
  BlogPostCreatePayload,
  BlogPostRead,
  BlogPostUpdatePayload,
  PaginatedBlogPosts,
} from './types';

type ListParams = {
  limit?: number;
  offset?: number;
};

export function listBlogPosts(
  token: string,
  params: ListParams = {},
): Promise<PaginatedBlogPosts> {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.offset !== undefined) query.set('offset', String(params.offset));
  const qs = query.toString();
  return request<PaginatedBlogPosts>(
    `/api/v1/blog-posts${qs ? `?${qs}` : ''}`,
    { token },
  );
}

function toCreateFormData(payload: BlogPostCreatePayload): FormData {
  const body = new FormData();
  body.append('title', payload.title);
  body.append('content', payload.content);
  for (const id of payload.category_ids ?? []) {
    body.append('category_ids', String(id));
  }
  for (const id of payload.subcategory_ids ?? []) {
    body.append('subcategory_ids', String(id));
  }
  if (payload.cover_file) body.append('file', payload.cover_file);
  if (payload.cover_url) body.append('url', payload.cover_url);
  return body;
}

function toUpdateFormData(payload: BlogPostUpdatePayload): FormData {
  const body = new FormData();
  if (payload.title !== undefined) body.append('title', payload.title);
  if (payload.content !== undefined) body.append('content', payload.content);
  if (payload.visible !== undefined) body.append('visible', String(payload.visible));
  if (payload.category_ids) {
    for (const id of payload.category_ids) body.append('category_ids', String(id));
  }
  if (payload.subcategory_ids) {
    for (const id of payload.subcategory_ids) body.append('subcategory_ids', String(id));
  }
  if (payload.cover_file) body.append('file', payload.cover_file);
  if (payload.cover_url) body.append('url', payload.cover_url);
  return body;
}

export function createBlogPost(
  payload: BlogPostCreatePayload,
  token: string,
): Promise<BlogPostRead> {
  return request<BlogPostRead>('/api/v1/blog-posts', {
    method: 'POST',
    body: toCreateFormData(payload),
    token,
  });
}

export function updateBlogPost(
  postId: number,
  payload: BlogPostUpdatePayload,
  token: string,
): Promise<BlogPostRead> {
  return request<BlogPostRead>(`/api/v1/blog-posts/${postId}`, {
    method: 'PATCH',
    body: toUpdateFormData(payload),
    token,
  });
}

export function deleteBlogPost(postId: number, token: string): Promise<null> {
  return request<null>(`/api/v1/blog-posts/${postId}`, {
    method: 'DELETE',
    token,
  });
}
