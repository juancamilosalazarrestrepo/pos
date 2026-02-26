'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createSupabaseBrowser } from '@/lib/supabase-browser';

interface Perfil {
    id: string;
    nombre: string;
    email: string;
    rol: 'admin' | 'cajero' | 'inventario';
    activo: boolean;
}

interface AuthContextType {
    user: User | null;
    perfil: Perfil | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    perfil: null,
    loading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [perfil, setPerfil] = useState<Perfil | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createSupabaseBrowser();

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data } = await supabase
                    .from('perfiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setPerfil(data);
            }

            setLoading(false);
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    const { data } = await supabase
                        .from('perfiles')
                        .select('*')
                        .eq('id', currentUser.id)
                        .single();
                    setPerfil(data);
                } else {
                    setPerfil(null);
                }

                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setPerfil(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, perfil, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
