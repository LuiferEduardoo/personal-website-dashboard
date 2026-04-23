import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import ImageDropzone from '../features/images/components/ImageDropzone';
import ImageGrid from '../features/images/components/ImageGrid';
import { deleteImage, uploadImage } from '../features/images/api';
import type { ImageRead } from '../features/images/types';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ImagesPage() {
  usePageTitle('Imágenes');
  const { token } = useAuth();
  const [images, setImages] = useState<ImageRead[]>([]);
  const [folder, setFolder] = useState('');
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!token) {
        setError('Sesión expirada.');
        return;
      }
      setError(null);
      setUploadingCount((n) => n + files.length);

      const uploads = files.map((file) =>
        uploadImage(file, token, folder || undefined)
          .then((image) => {
            setImages((prev) => [image, ...prev]);
          })
          .catch((err) => {
            const message =
              err instanceof ApiError
                ? err.message
                : `No se pudo subir "${file.name}".`;
            setError(message);
          })
          .finally(() => {
            setUploadingCount((n) => Math.max(0, n - 1));
          }),
      );

      await Promise.all(uploads);
    },
    [token, folder],
  );

  const handleDelete = useCallback(
    async (image: ImageRead) => {
      if (!token) return;
      const confirmed = window.confirm(
        `¿Borrar la imagen "${image.name}"? Esta acción no se puede deshacer.`,
      );
      if (!confirmed) return;

      setDeletingId(image.id);
      setError(null);
      try {
        await deleteImage(image.id, token);
        setImages((prev) => prev.filter((img) => img.id !== image.id));
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : 'No se pudo borrar la imagen.',
        );
      } finally {
        setDeletingId(null);
      }
    },
    [token],
  );

  const isUploading = uploadingCount > 0;

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Imágenes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sube imágenes para usarlas en publicaciones y proyectos. Se convertirán a WebP y
          se almacenarán en el object storage.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <label
          htmlFor="image-folder"
          className="text-sm font-medium text-gray-700"
        >
          Carpeta (opcional)
        </label>
        <input
          id="image-folder"
          type="text"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          placeholder="p. ej. blog-content, projects-content"
          disabled={isUploading}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <ImageDropzone onFiles={handleFiles} disabled={isUploading} />

        {isUploading && (
          <p className="text-xs text-gray-500">
            Subiendo {uploadingCount} {uploadingCount === 1 ? 'imagen' : 'imágenes'}…
          </p>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Subidas en esta sesión
          </h2>
          <span className="text-xs text-gray-400">
            La API no expone un listado completo; solo se muestran las imágenes subidas
            aquí.
          </span>
        </div>
        <ImageGrid
          images={images}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </div>
    </section>
  );
}
