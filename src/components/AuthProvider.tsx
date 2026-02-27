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
    supabase: ReturnType<typeof createSupabaseBrowser>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    perfil: null,
    loading: true,
    supabase: createSupabaseBrowser(),
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
            console.log("AuthProvider: Buscando usuario inicial...");
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) console.error("AuthProvider Error getUser:", userError);

                console.log("AuthProvider: Usuario encontrado:", user?.id || "Ninguno");
                setUser(user);

                if (user) {
                    console.log("AuthProvider: Buscando perfil para:", user.id);
                    const { data: profileData, error: profileError } = await supabase
                        .from('perfiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (profileError) console.error("AuthProvider Error perfil:", profileError);
                    console.log("AuthProvider: Perfil cargado:", profileData?.rol || "Sin rol");
                    setPerfil(profileData);
                }
            } catch (err) {
                console.error("AuthProvider: EXCEPCIÓN en getSession:", err);
            } finally {
                console.log("AuthProvider: Marcando loading = false");
                setLoading(false);
            }
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log("AuthProvider: AUTH CHANGE EVENT:", event);
                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    console.log("AuthProvider: Cargando perfil por auth change...");
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
        <AuthContext.Provider value={{ user, perfil, loading, supabase, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
