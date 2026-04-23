import { Navigate, useNavigate, useParams } from 'react-router-dom';
import BlogEditor from '../../features/blog/components/BlogEditor';
import { useBlogPosts } from '../../features/blog/context';
import type { BlogPostUpdatePayload } from '../../features/blog/types';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function BlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById, updatePost, loading } = useBlogPosts();

  const postId = Number(id);
  const post = Number.isFinite(postId) ? getById(postId) : undefined;
  usePageTitle(post ? `Editar: ${post.title}` : 'Editar publicación');

  if (!Number.isFinite(postId)) {
    return <Navigate to="/blogs" replace />;
  }

  if (loading) {
    return (
      <section className="py-12 text-center text-sm text-gray-500">
        Cargando publicación…
      </section>
    );
  }

  if (!post) {
    return (
      <section className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <h2 className="text-base font-medium text-gray-900">
          Publicación no encontrada
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          La publicación que intentas editar no existe o fue eliminada.
        </p>
        <button
          type="button"
          onClick={() => navigate('/blogs')}
          className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Volver al listado
        </button>
      </section>
    );
  }

  const handleUpdate = async (payload: BlogPostUpdatePayload) => {
    await updatePost(post.id, payload);
    navigate('/blogs');
  };

  return (
    <BlogEditor
      post={post}
      onCancel={() => navigate('/blogs')}
      onSubmitUpdate={handleUpdate}
    />
  );
}
