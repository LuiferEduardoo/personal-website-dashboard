import { usePageTitle } from '../../hooks/usePageTitle';
import { ChangePasswordForm } from '../../features/auth';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  usePageTitle('Configuración');
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Configuración
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          Administra tu cuenta y preferencias de seguridad.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
        <section className="flex-1 rounded-xl border border-gray-200 bg-white shadow-sm max-w-2xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Seguridad de la cuenta
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Actualiza tu contraseña para mantener tu cuenta segura.
            </p>
          </div>
          
          <div className="px-6 py-6">
            <ChangePasswordForm />
          </div>
        </section>

        {user && (
          <section className="w-full shrink-0 md:w-80 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Tu perfil
              </h2>
            </div>
            <div className="px-6 py-6 flex flex-col gap-4">
              {user.profile_photo ? (
                <img
                  src={user.profile_photo.url}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover shadow-sm ring-4 ring-gray-50"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}