import type { ImageRead } from '../user/types';

export type AuthorBrief = {
  id: number;
  name: string;
};

export type CategoryRead = {
  id: number;
  name: string;
};

export type SubcategoryRead = {
  id: number;
  name: string;
  category_id?: number;
};

export type BlogPostRead = {
  id: number;
  title: string;
  content: string;
  link: string;
  reading_time: string | null;
  visible: boolean;
  user: AuthorBrief;
  cover_image: ImageRead | null;
  authors: AuthorBrief[];
  categories: CategoryRead[];
  subcategories: SubcategoryRead[];
  created_at: string;
  updated_at: string;
};

export type PaginatedBlogPosts = {
  items: BlogPostRead[];
  total: number;
  limit: number;
  offset: number;
};

export type BlogPostCreatePayload = {
  title: string;
  content: string;
  category_ids?: number[];
  subcategory_ids?: number[];
  cover_file?: File | null;
  cover_url?: string | null;
};

export type BlogPostUpdatePayload = {
  title?: string;
  content?: string;
  visible?: boolean;
  category_ids?: number[];
  subcategory_ids?: number[];
  cover_file?: File | null;
  cover_url?: string | null;
};
