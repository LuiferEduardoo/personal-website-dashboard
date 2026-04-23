import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

export default function App() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          Sesión iniciada
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Bienvenido al dashboard.
        </p>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
