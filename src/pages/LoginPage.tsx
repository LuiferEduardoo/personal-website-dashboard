import { LoginForm } from '../features/auth';
import { usePageTitle } from '../hooks/usePageTitle';

export default function LoginPage() {
  usePageTitle('Iniciar sesión');

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <header className="mb-6 flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Iniciar sesión
          </h1>
          <p className="text-sm text-gray-500">
            Ingresa tus credenciales para acceder al dashboard.
          </p>
        </header>
        <LoginForm />
      </div>
    </main>
  );
}
