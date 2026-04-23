import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../../lib/api';
import BlogList from '../../features/blog/components/BlogList';
import { useBlogPosts } from '../../features/blog/context';
import type { BlogPostRead } from '../../features/blog/types';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function BlogListPage() {
  usePageTitle('Blog');
  const { posts, loading, error: listError, removePost } = useBlogPosts();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<BlogPostRead | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await removePost(pendingDelete.id);
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo borrar la publicación.',
      );
    } finally {
      setDeleting(false);
    }
  }, [pendingDelete, removePost]);

  if (loading) {
    return (
      <section className="py-12 text-center text-sm text-gray-500">
        Cargando publicaciones…
      </section>
    );
  }

  const error = deleteError ?? listError;

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
        onCreate={() => navigate('/blogs/new')}
        onEdit={(post) => navigate(`/blogs/${post.id}/edit`)}
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
