'use server';

import { createClient } from '@supabase/supabase-js';

export async function crearUsuarioAdmin(formData: any) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceRoleKey) {
            return { error: 'Missing Supabase administrative configuration.' };
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: formData.email,
            password: formData.password,
            email_confirm: true,
            user_metadata: {
                nombre: formData.nombre,
                rol: formData.rol,
            },
        });

        if (error) {
            return { error: error.message };
        }

        return { user: data.user };
    } catch (err: any) {
        return { error: err.message || 'Unknown error creating user' };
    }
}
