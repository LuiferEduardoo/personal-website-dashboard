import Skeleton from '../../../components/ui/Skeleton';
import type { BlogPostRead } from '../types';

type Props = {
  posts: BlogPostRead[];
  loading?: boolean;
  onCreate: () => void;
  onEdit: (post: BlogPostRead) => void;
  onDelete: (post: BlogPostRead) => void;
};

const SKELETON_COUNT = 6;

function BlogCardSkeleton() {
  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-4/5" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="mt-auto flex justify-end gap-2 pt-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </li>
  );
}

function stripHtml(html: string, maxLength = 180): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function BlogList({ posts, loading, onCreate, onEdit, onDelete }: Props) {
  return (
    <section>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Blog</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las publicaciones del blog.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          Nueva publicación
        </button>
      </header>

      {loading ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            <BlogCardSkeleton key={idx} />
          ))}
        </ul>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <h2 className="text-base font-medium text-gray-900">No hay publicaciones</h2>
          <p className="mt-1 text-sm text-gray-500">
            Crea la primera entrada del blog para verla aquí.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {post.cover_image && (
                <img
                  src={post.cover_image.url}
                  alt={post.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatDate(post.created_at)}</span>
                  {!post.visible && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                      Oculto
                    </span>
                  )}
                </div>
                <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
                  {post.title}
                </h3>
                <p className="line-clamp-3 text-sm text-gray-600">
                  {stripHtml(post.content)}
                </p>
                <div className="mt-auto flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onEdit(post)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(post)}
                    className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
