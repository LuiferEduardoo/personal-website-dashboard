import { useState } from 'react';
import Skeleton from '../../../components/ui/Skeleton';
import type { ImageRead } from '../types';

type Props = {
  images: ImageRead[];
  onDelete: (image: ImageRead) => void;
  deletingId?: number | null;
  uploadingCount?: number;
};

function ImageTileSkeleton() {
  return (
    <li className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-3/4" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </li>
  );
}

export default function ImageGrid({
  images,
  onDelete,
  deletingId,
  uploadingCount = 0,
}: Props) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  async function handleCopy(image: ImageRead) {
    try {
      await navigator.clipboard.writeText(image.url);
      setCopiedId(image.id);
      setTimeout(() => setCopiedId((current) => (current === image.id ? null : current)), 1500);
    } catch {
      window.prompt('Copia la URL manualmente:', image.url);
    }
  }

  if (images.length === 0 && uploadingCount === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
        <p className="text-sm text-gray-500">Aún no has subido imágenes en esta sesión.</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: uploadingCount }).map((_, idx) => (
        <ImageTileSkeleton key={`uploading-${idx}`} />
      ))}
      {images.map((image) => {
        const isDeleting = deletingId === image.id;
        return (
          <li
            key={image.id}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="aspect-square w-full overflow-hidden bg-gray-100">
              <img
                src={image.url}
                alt={image.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col gap-2 p-3">
              <p
                className="truncate text-xs font-medium text-gray-700"
                title={image.name}
              >
                {image.name}
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopy(image)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  {copiedId === image.id ? 'Copiada ✓' : 'Copiar URL'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(image)}
                  disabled={isDeleting}
                  className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={`Borrar ${image.name}`}
                  title="Borrar"
                >
                  {isDeleting ? '…' : 'Borrar'}
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
