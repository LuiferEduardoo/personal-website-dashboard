import { useState, type FormEvent } from 'react';
import { changePassword } from '../api';
import { ApiError } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function ChangePasswordForm() {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isNewPasswordValid = hasLength && hasUpper && hasNumber && hasSpecial;

  const showNewPasswordError = newPassword.length > 0 && !isNewPasswordValid;
  const showConfirmPasswordError = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const isFormValid =
    currentPassword.length > 0 &&
    isNewPasswordValid &&
    newPassword === confirmPassword;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Sesión expirada.');
      return;
    }

    if (!isFormValid) {
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(token, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccess('Contraseña actualizada correctamente.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo cambiar la contraseña. Intenta de nuevo.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-sm" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
          Contraseña actual
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={submitting}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
          Nueva contraseña
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={255}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={submitting}
          className={`rounded-md border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            showNewPasswordError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30'
              : 'border-gray-300 focus:border-primary focus:ring-primary/30'
          }`}
        />
        {showNewPasswordError ? (
          <span className="text-xs text-red-600">
            Debe tener: 8+ caracteres, 1 mayúscula, 1 número y 1 carácter especial.
          </span>
        ) : (
          <span className="text-xs text-gray-500">
            Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 especial.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirmar nueva contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={255}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={submitting}
          className={`rounded-md border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            showConfirmPasswordError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30'
              : 'border-gray-300 focus:border-primary focus:ring-primary/30'
          }`}
        />
        {showConfirmPasswordError && (
          <span className="text-xs text-red-600">Las contraseñas nuevas no coinciden.</span>
        )}
      </div>

      {success && (
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
        disabled={submitting || !isFormValid}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Guardando…' : 'Cambiar contraseña'}
      </button>
    </form>
  );
}