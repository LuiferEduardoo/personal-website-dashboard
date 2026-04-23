import { useContext } from 'react';
import { BlogPostsContext } from './BlogPostsContext';

export function useBlogPosts() {
  const ctx = useContext(BlogPostsContext);
  if (!ctx) {
    throw new Error('useBlogPosts must be used within a BlogPostsProvider');
  }
  return ctx;
}
