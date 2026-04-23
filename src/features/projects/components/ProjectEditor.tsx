import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import RichTextEditor from '../../../components/RichTextEditor';
import { ApiError } from '../../../lib/api';
import type {
  ProjectCreatePayload,
  ProjectRead,
  ProjectUpdatePayload,
} from '../types';

type Props = {
  project?: ProjectRead;
  onCancel: () => void;
  onSubmitCreate?: (payload: ProjectCreatePayload) => Promise<void>;
  onSubmitUpdate?: (payload: ProjectUpdatePayload) => Promise<void>;
};

export default function ProjectEditor({
  project,
  onCancel,
  onSubmitCreate,
  onSubmitUpdate,
}: Props) {
  const isEdit = Boolean(project);
  const [name, setName] = useState(project?.name ?? '');
  const [briefDescription, setBriefDescription] = useState(
    project?.brief_description ?? '',
  );
  const [urlProject, setUrlProject] = useState(project?.url_project ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [visible, setVisible] = useState(project?.visible ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(project?.image?.url ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const hasImagePreview = Boolean(imageFile) || Boolean(imageUrl);
  const imagePreviewUrl = imageFile ? URL.createObjectURL(imageFile) : imageUrl;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setImageUrl('');
  };

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) return setError('El nombre es obligatorio.');
    if (!briefDescription.trim()) return setError('La descripción breve es obligatoria.');
    if (!description.trim() || description === '<p></p>') {
      return setError('La descripción es obligatoria.');
    }

    setSubmitting(true);
    try {
      if (isEdit && onSubmitUpdate && project) {
        const payload: ProjectUpdatePayload = {};
        if (name !== project.name) payload.name = name;
        if (briefDescription !== project.brief_description) {
          payload.brief_description = briefDescription;
        }
        if (urlProject !== project.url_project) payload.url_project = urlProject;
        if (description !== project.description) payload.description = description;
        if (visible !== project.visible) payload.visible = visible;
        if (imageFile) payload.image_file = imageFile;
        else if (imageUrl && imageUrl !== project.image?.url) payload.image_url = imageUrl;
        await onSubmitUpdate(payload);
      } else if (onSubmitCreate) {
        await onSubmitCreate({
          name,
          brief_description: briefDescription,
          description,
          url_project: urlProject || undefined,
          visible,
          image_file: imageFile,
          image_url: imageUrl || null,
        });
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo guardar el proyecto. Intenta de nuevo.';
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
            {isEdit ? 'Editar proyecto' : 'Nuevo proyecto'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit
              ? 'Actualiza la información del proyecto.'
              : 'Completa los datos del proyecto y agrega una imagen opcional.'}
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
            {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear proyecto'}
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-name" className="text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="project-name"
            type="text"
            required
            maxLength={512}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-url" className="text-sm font-medium text-gray-700">
            URL del proyecto{' '}
            <span className="font-normal text-gray-400">(opcional)</span>
          </label>
          <input
            id="project-url"
            type="url"
            maxLength={2048}
            placeholder="https://..."
            value={urlProject}
            onChange={(e) => setUrlProject(e.target.value)}
            disabled={submitting}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="project-brief"
          className="text-sm font-medium text-gray-700"
        >
          Descripción breve
        </label>
        <textarea
          id="project-brief"
          required
          rows={2}
          value={briefDescription}
          onChange={(e) => setBriefDescription(e.target.value)}
          disabled={submitting}
          placeholder="Resumen corto que aparecerá en las tarjetas del portafolio."
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <fieldset className="flex flex-col gap-2" disabled={submitting}>
        <legend className="text-sm font-medium text-gray-700">Imagen</legend>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary-hover"
          />
          <span className="text-xs text-gray-400">o</span>
          <input
            type="url"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              if (e.target.value) setImageFile(null);
            }}
            className="flex-1 min-w-48 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        {hasImagePreview && imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Imagen del proyecto"
            className="mt-2 max-h-48 w-fit rounded-lg border border-gray-200 object-cover"
          />
        )}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Descripción</label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Describe el proyecto en detalle..."
          uploadFolder="projects-content"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
          disabled={submitting}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        Proyecto visible en el portafolio
      </label>
    </form>
  );
}
