import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ApiError } from '../../../lib/api';
import {
  createBlogPost,
  deleteBlogPost,
  listBlogPosts,
  updateBlogPost,
} from '../api';
import type {
  BlogPostCreatePayload,
  BlogPostRead,
  BlogPostUpdatePayload,
} from '../types';

type BlogPostsContextValue = {
  posts: BlogPostRead[];
  loading: boolean;
  error: string | null;
  getById: (id: number) => BlogPostRead | undefined;
  createPost: (payload: BlogPostCreatePayload) => Promise<BlogPostRead>;
  updatePost: (id: number, payload: BlogPostUpdatePayload) => Promise<BlogPostRead>;
  removePost: (id: number) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const BlogPostsContext = createContext<BlogPostsContextValue | null>(null);

const LIST_LIMIT = 50;

type Props = { children: ReactNode };

export function BlogPostsProvider({ children }: Props) {
  const { token } = useAuth();
  const [posts, setPosts] = useState<BlogPostRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    listBlogPosts(token, { limit: LIST_LIMIT })
      .then((res) => {
        if (!cancelled) setPosts(res.items);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : 'No se pudieron cargar las publicaciones.',
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const createPost = useCallback(
    async (payload: BlogPostCreatePayload) => {
      if (!token) throw new Error('Sesión expirada.');
      const created = await createBlogPost(payload, token);
      setPosts((prev) => [created, ...prev]);
      return created;
    },
    [token],
  );

  const updatePost = useCallback(
    async (id: number, payload: BlogPostUpdatePayload) => {
      if (!token) throw new Error('Sesión expirada.');
      const updated = await updateBlogPost(id, payload, token);
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      return updated;
    },
    [token],
  );

  const removePost = useCallback(
    async (id: number) => {
      if (!token) throw new Error('Sesión expirada.');
      await deleteBlogPost(id, token);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    },
    [token],
  );

  const getById = useCallback(
    (id: number) => posts.find((p) => p.id === id),
    [posts],
  );

  const value = useMemo<BlogPostsContextValue>(
    () => ({ posts, loading, error, getById, createPost, updatePost, removePost }),
    [posts, loading, error, getById, createPost, updatePost, removePost],
  );

  return (
    <BlogPostsContext.Provider value={value}>{children}</BlogPostsContext.Provider>
  );
}
