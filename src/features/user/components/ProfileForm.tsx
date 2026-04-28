import { useState, type FormEvent, useEffect } from 'react';
import { updateMe } from '../api';
import { ApiError } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import type { UserRead } from '../types';

type Props = {
  user: UserRead;
  onUpdate: (user: UserRead) => void;
};

export default function ProfileForm({ user, onUpdate }: Props) {
  const { token } = useAuth();
  
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const hasChanges = name !== user.name || email !== user.email;
  const isFormValid = name.trim().length > 0 && email.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Sesión expirada.');
      return;
    }

    if (!isFormValid || !hasChanges) {
      return;
    }

    setSubmitting(true);
    try {
      const updatedUser = await updateMe(token, { name, email });
      onUpdate(updatedUser);
      setSuccess('Perfil actualizado correctamente.');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo actualizar el perfil. Intenta de nuevo.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-sm" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre completo
        </label>
        <input
          id="name"
          type="text"
          required
          maxLength={255}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSuccess(null);
          }}
          disabled={submitting}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSuccess(null);
          }}
          disabled={submitting}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {success && !hasChanges && (
        <p
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
        >
          {success}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !isFormValid || !hasChanges}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  );
}