import { usePageTitle } from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';
import ProfileForm from '../../features/user/components/ProfileForm';
import ProfilePhotoUpload from '../../features/user/components/ProfilePhotoUpload';

export default function ProfilePage() {
  usePageTitle('Perfil');
  const { user, updateUser } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Mi Perfil
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          Administra tu información personal y foto de perfil.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
        <section className="flex-1 rounded-xl border border-gray-200 bg-white shadow-sm max-w-2xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Foto de perfil
            </h2>
          </div>
          
          <div className="px-6 py-6 border-b border-gray-100">
            <ProfilePhotoUpload user={user} onUpdate={updateUser} />
          </div>

          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Información personal
            </h2>
          </div>
          
          <div className="px-6 py-6">
            <ProfileForm user={user} onUpdate={updateUser} />
          </div>
        </section>
      </div>
    </div>
  );
}