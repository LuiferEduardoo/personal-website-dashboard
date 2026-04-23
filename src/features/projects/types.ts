import type { ImageRead } from '../user/types';
import type { CategoryRead, SubcategoryRead } from '../blog/types';

export type ProjectRead = {
  id: number;
  name: string;
  brief_description: string;
  description: string;
  link: string;
  visible: boolean;
  url_project: string;
  image: ImageRead | null;
  categories: CategoryRead[];
  subcategories: SubcategoryRead[];
  created_at: string;
  updated_at: string;
};

export type PaginatedProjects = {
  items: ProjectRead[];
  total: number;
  limit: number;
  offset: number;
};

export type ProjectCreatePayload = {
  name: string;
  brief_description: string;
  description: string;
  url_project: string;
  visible?: boolean;
  category_ids?: number[];
  subcategory_ids?: number[];
  image_file?: File | null;
  image_url?: string | null;
};

export type ProjectUpdatePayload = {
  name?: string;
  brief_description?: string;
  description?: string;
  url_project?: string;
  visible?: boolean;
  category_ids?: number[];
  subcategory_ids?: number[];
  image_file?: File | null;
  image_url?: string | null;
};
