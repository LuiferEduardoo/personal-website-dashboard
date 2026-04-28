import { useState, useRef } from 'react';
import { updateProfilePhoto } from '../api';
import { ApiError } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import type { UserRead } from '../types';

type Props = {
  user: UserRead;
  onUpdate: (user: UserRead) => void;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function ProfilePhotoUpload({ user, onUpdate }: Props) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida.');
      setSuccess(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('La imagen no debe superar los 5MB.');
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const updatedUser = await updateProfilePhoto(token, file);
      onUpdate(updatedUser);
      setSuccess('Foto de perfil actualizada correctamente.');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Error al subir la imagen. Intenta nuevamente.';
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0 rounded-full bg-gray-100 ring-4 ring-white shadow-sm overflow-hidden">
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="text-xs font-medium text-gray-700">Subiendo…</span>
            </div>
          ) : user.profile_photo ? (
            <img
              src={user.profile_photo.url}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-semibold text-primary">
              {getInitials(user.name) || '?'}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex w-fit items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cambiar foto
          </button>
          <p className="text-xs text-gray-500">
            JPG, PNG o GIF (Máx. 5MB)
          </p>
        </div>
      </div>

      {success && (
        <p
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 max-w-sm"
        >
          {success}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 max-w-sm"
        >
          {error}
        </p>
      )}
    </div>
  );
}