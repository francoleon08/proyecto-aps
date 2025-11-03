'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { fetchUserData, updateUserProfile } from '@/lib/profile';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        setName(userData.name);
        setEmail(userData.email);
        setPhone(userData.phone || '');
        setAddress(userData.address || '');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error al obtener los datos del usuario',
          variant: 'destructive',
        });
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await updateUserProfile({ name, phone, address });
      toast({
        title: 'Perfil Actualizado Correctamente',
        description: data.message,
      });
      setTimeout(() => {
        setIsEditing(false);
      }, 50);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="text-2xl font-bold">Perfil de Usuario</CardTitle>
          <CardDescription className="text-gray-600">Actualiza tu información de perfil.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nombre</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Teléfono</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address" className="text-sm font-medium">Dirección</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
              </div>
              <CardFooter className="mt-6 flex justify-end gap-2">
                <Button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Cancelar
                </Button>
              </CardFooter>
            </form>
          ) : (
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                <p className="mt-1 text-gray-900">{name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="mt-1 text-gray-900">{email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                <p className="mt-1 text-gray-900">{phone || '-'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Dirección</Label>
                <p className="mt-1 text-gray-900">{address || '-'}</p>
              </div>
            </div>
          )}
        </CardContent>
        {!isEditing && (
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Editar Perfil</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
