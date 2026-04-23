import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import RichTextEditor from './RichTextEditor';
import { ApiError } from '../../../lib/api';
import type {
  BlogPostCreatePayload,
  BlogPostRead,
  BlogPostUpdatePayload,
} from '../types';

type Props = {
  post?: BlogPostRead;
  onCancel: () => void;
  onSubmitCreate?: (payload: BlogPostCreatePayload) => Promise<void>;
  onSubmitUpdate?: (payload: BlogPostUpdatePayload) => Promise<void>;
};

export default function BlogEditor({
  post,
  onCancel,
  onSubmitCreate,
  onSubmitUpdate,
}: Props) {
  const isEdit = Boolean(post);
  const [title, setTitle] = useState(post?.title ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [visible, setVisible] = useState(post?.visible ?? true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState(post?.cover_image?.url ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const hasCoverPreview = Boolean(coverFile) || Boolean(coverUrl);
  const coverPreviewUrl = coverFile ? URL.createObjectURL(coverFile) : coverUrl;

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    if (file) setCoverUrl('');
  };

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    if (!content.trim() || content === '<p></p>') {
      setError('El contenido es obligatorio.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && onSubmitUpdate) {
        const payload: BlogPostUpdatePayload = {};
        if (title !== post?.title) payload.title = title;
        if (content !== post?.content) payload.content = content;
        if (visible !== post?.visible) payload.visible = visible;
        if (coverFile) payload.cover_file = coverFile;
        else if (coverUrl && coverUrl !== post?.cover_image?.url) payload.cover_url = coverUrl;
        await onSubmitUpdate(payload);
      } else if (onSubmitCreate) {
        await onSubmitCreate({
          title,
          content,
          cover_file: coverFile,
          cover_url: coverUrl || null,
        });
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo guardar la publicación. Intenta de nuevo.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEdit ? 'Editar publicación' : 'Nueva publicación'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit
              ? 'Actualiza el contenido y la visibilidad del artículo.'
              : 'Redacta el contenido y adjunta una imagen de portada opcional.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Publicar'}
          </button>
        </div>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="post-title" className="text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          id="post-title"
          type="text"
          required
          maxLength={512}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <fieldset className="flex flex-col gap-2" disabled={submitting}>
        <legend className="text-sm font-medium text-gray-700">Imagen de portada</legend>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary-hover"
          />
          <span className="text-xs text-gray-400">o</span>
          <input
            type="url"
            placeholder="https://..."
            value={coverUrl}
            onChange={(e) => {
              setCoverUrl(e.target.value);
              if (e.target.value) setCoverFile(null);
            }}
            className="flex-1 min-w-48 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        {hasCoverPreview && coverPreviewUrl && (
          <img
            src={coverPreviewUrl}
            alt="Portada"
            className="mt-2 max-h-48 w-fit rounded-lg border border-gray-200 object-cover"
          />
        )}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Contenido</label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Empieza a escribir tu artículo..."
        />
      </div>

      {isEdit && (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            disabled={submitting}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          Publicación visible
        </label>
      )}
    </form>
  );
}
