import { request } from '../../lib/api';
import type {
  PaginatedProjects,
  ProjectCreatePayload,
  ProjectRead,
  ProjectUpdatePayload,
} from './types';

type ListParams = {
  limit?: number;
  offset?: number;
};

export function listProjects(params: ListParams = {}): Promise<PaginatedProjects> {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.offset !== undefined) query.set('offset', String(params.offset));
  const qs = query.toString();
  return request<PaginatedProjects>(`/api/v1/projects${qs ? `?${qs}` : ''}`);
}

function toCreateFormData(payload: ProjectCreatePayload): FormData {
  const body = new FormData();
  body.append('name', payload.name);
  body.append('brief_description', payload.brief_description);
  body.append('description', payload.description);
  body.append('url_project', payload.url_project);
  if (payload.visible !== undefined) body.append('visible', String(payload.visible));
  for (const id of payload.category_ids ?? []) {
    body.append('category_ids', String(id));
  }
  for (const id of payload.subcategory_ids ?? []) {
    body.append('subcategory_ids', String(id));
  }
  if (payload.image_file) body.append('file', payload.image_file);
  if (payload.image_url) body.append('url', payload.image_url);
  return body;
}

function toUpdateFormData(payload: ProjectUpdatePayload): FormData {
  const body = new FormData();
  if (payload.name !== undefined) body.append('name', payload.name);
  if (payload.brief_description !== undefined) {
    body.append('brief_description', payload.brief_description);
  }
  if (payload.description !== undefined) body.append('description', payload.description);
  if (payload.url_project !== undefined) body.append('url_project', payload.url_project);
  if (payload.visible !== undefined) body.append('visible', String(payload.visible));
  if (payload.category_ids) {
    for (const id of payload.category_ids) body.append('category_ids', String(id));
  }
  if (payload.subcategory_ids) {
    for (const id of payload.subcategory_ids) body.append('subcategory_ids', String(id));
  }
  if (payload.image_file) body.append('file', payload.image_file);
  if (payload.image_url) body.append('url', payload.image_url);
  return body;
}

export function createProject(
  payload: ProjectCreatePayload,
  token: string,
): Promise<ProjectRead> {
  return request<ProjectRead>('/api/v1/projects', {
    method: 'POST',
    body: toCreateFormData(payload),
    token,
  });
}

export function updateProject(
  projectId: number,
  payload: ProjectUpdatePayload,
  token: string,
): Promise<ProjectRead> {
  return request<ProjectRead>(`/api/v1/projects/${projectId}`, {
    method: 'PATCH',
    body: toUpdateFormData(payload),
    token,
  });
}

export function deleteProject(projectId: number, token: string): Promise<null> {
  return request<null>(`/api/v1/projects/${projectId}`, {
    method: 'DELETE',
    token,
  });
}
