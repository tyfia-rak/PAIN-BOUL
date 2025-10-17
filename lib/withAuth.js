"use client";
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const [loading, setLoading] = useState(true);
        const [session, setSession] = useState(null);
        const router = useRouter();

        useEffect(() => {
            const checkSession = async () => {
                const session = await getSession();
                if (!session || session.user?.role !== 'admin') {
                    router.push('/admin/login');
                } else {
                    setSession(session);
                }
                setLoading(false);
            }
            checkSession();
        }, []);

        if (loading) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden mx-auto mb-4"></div>
                        <p className="text-foreground font-inter">Chargement...</p>
                    </div>
                </div>
            );
        }

        return <Component {...props} session={session} />;
    };
}