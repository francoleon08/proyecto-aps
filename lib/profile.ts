import { AuthUser } from './auth';

export interface ProfileData {
  name: string;
  phone: string;
  address: string;
}

export const fetchUserData = async (): Promise<AuthUser> => {
  const response = await fetch('/api/auth/me');
  if (!response.ok) {
    throw new Error('Error al obtener los datos del usuario');
  }
  return response.json();
};

export const updateUserProfile = async (profileData: ProfileData): Promise<any> => {
  const response = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Algo salió mal');
  }

  return response.json();
};