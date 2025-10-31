'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-playfair text-2xl font-bold text-foreground mb-4">
          Redirection...
        </h1>
        <p className="text-muted-foreground font-inter">
          Vous allez être redirigé vers la page de connexion.
        </p>
      </div>
    </div>
  );
}
