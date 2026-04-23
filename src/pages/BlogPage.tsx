import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import BlogList from '../features/blog/components/BlogList';
import BlogEditor from '../features/blog/components/BlogEditor';
import {
  createBlogPost,
  deleteBlogPost,
  listBlogPosts,
  updateBlogPost,
} from '../features/blog/api';
import type {
  BlogPostCreatePayload,
  BlogPostRead,
  BlogPostUpdatePayload,
} from '../features/blog/types';

type View =
  | { kind: 'list' }
  | { kind: 'create' }
  | { kind: 'edit'; post: BlogPostRead };

const LIST_LIMIT = 50;

export default function BlogPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<BlogPostRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>({ kind: 'list' });
  const [pendingDelete, setPendingDelete] = useState<BlogPostRead | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleCreate = useCallback(
    async (payload: BlogPostCreatePayload) => {
      if (!token) throw new Error('Sesión expirada.');
      const created = await createBlogPost(payload, token);
      setPosts((prev) => [created, ...prev]);
      setView({ kind: 'list' });
    },
    [token],
  );

  const handleUpdate = useCallback(
    async (post: BlogPostRead, payload: BlogPostUpdatePayload) => {
      if (!token) throw new Error('Sesión expirada.');
      const updated = await updateBlogPost(post.id, payload, token);
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setView({ kind: 'list' });
    },
    [token],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete || !token) return;
    setDeleting(true);
    try {
      await deleteBlogPost(pendingDelete.id, token);
      setPosts((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo borrar la publicación.',
      );
    } finally {
      setDeleting(false);
    }
  }, [pendingDelete, token]);

  if (view.kind === 'create') {
    return (
      <BlogEditor
        onCancel={() => setView({ kind: 'list' })}
        onSubmitCreate={handleCreate}
      />
    );
  }

  if (view.kind === 'edit') {
    const currentPost = view.post;
    return (
      <BlogEditor
        post={currentPost}
        onCancel={() => setView({ kind: 'list' })}
        onSubmitUpdate={(payload) => handleUpdate(currentPost, payload)}
      />
    );
  }

  if (loading) {
    return (
      <section className="py-12 text-center text-sm text-gray-500">
        Cargando publicaciones…
      </section>
    );
  }

  return (
    <>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <BlogList
        posts={posts}
        onCreate={() => setView({ kind: 'create' })}
        onEdit={(post) => setView({ kind: 'edit', post })}
        onDelete={(post) => setPendingDelete(post)}
      />

      {pendingDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          className="fixed inset-0 z-30 flex items-center justify-center bg-gray-900/50 px-4"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 id="delete-title" className="text-lg font-semibold text-gray-900">
              Borrar publicación
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Seguro que quieres borrar{' '}
              <span className="font-medium text-gray-900">
                "{pendingDelete.title}"
              </span>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? 'Borrando…' : 'Borrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
