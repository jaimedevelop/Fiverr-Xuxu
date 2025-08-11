// src/pages/admin/Settings.tsx
import React from 'react';
import { useUser } from '../../contexts/UserContext';
import SettingsComponent from '../../components/admin/settings/SettingsComponent';

const Settings: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SettingsComponent user={user} />
    </div>
  );
};

export default Settings;