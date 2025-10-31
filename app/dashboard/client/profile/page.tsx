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
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await updateUserProfile({ name, phone, address });
      toast({
        title: 'Perfil Actualizado Correctamente',
        description: data.message,
      });
      setIsEditing(false);
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
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
        <CardDescription>Actualiza tu información de perfil.</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            </div>
            <CardFooter className="mt-4">
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                  Cancelar
                </Button>
              </div>
            </CardFooter>
          </form>
        ) : (
          <div className="grid gap-4">
            <div>
              <Label>Nombre</Label>
              <p>{name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p>{email}</p>
            </div>
            <div>
              <Label>Teléfono</Label>
              <p>{phone || '-'}</p>
            </div>
            <div>
              <Label>Dirección</Label>
              <p>{address || '-'}</p>
            </div>
          </div>
        )}
      </CardContent>
      {!isEditing && (
        <CardFooter>
          <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
        </CardFooter>
      )}

    </Card>
  );
}
