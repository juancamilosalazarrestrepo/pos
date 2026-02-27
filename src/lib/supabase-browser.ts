import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | undefined;

export function createSupabaseBrowser() {
    // Si estamos en el servidor (durante SSR), NO usamos caché para evitar
    // que diferentes peticiones se crucen y rompan la hidratación de Next.js
    if (typeof window === 'undefined') {
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }

    // Si estamos en el navegador del cliente, USAMOS caché para evitar
    // crear múltiples clientes que bloqueen (deadlock) el localStorage
    if (!supabaseClient) {
        supabaseClient = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }

    return supabaseClient;
}
