'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

type TestResult = {
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
};

export default function TestPage() {
    const [results, setResults] = useState<TestResult[]>([]);
    const [running, setRunning] = useState(false);

    const runTests = async () => {
        setRunning(true);
        const tests: TestResult[] = [];

        // Test 1: Connection
        try {
            const { data, error } = await supabase.from('categorias').select('count');
            if (error) throw error;
            tests.push({ name: 'Conexión a Supabase', status: 'success', message: 'Conectado correctamente' });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            tests.push({ name: 'Conexión a Supabase', status: 'error', message: msg });
        }
        setResults([...tests]);

        // Test 2: Read categorias
        try {
            const { data, error } = await supabase.from('categorias').select('*');
            if (error) throw error;
            tests.push({
                name: 'Leer categorías',
                status: 'success',
                message: `${data.length} categorías encontradas`,
            });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            tests.push({ name: 'Leer categorías', status: 'error', message: msg });
        }
        setResults([...tests]);

        // Test 3: Read productos
        try {
            const { data, error } = await supabase.from('productos').select('*, categorias(nombre)');
            if (error) throw error;
            tests.push({
                name: 'Leer productos',
                status: 'success',
                message: `${data.length} productos encontrados`,
            });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            tests.push({ name: 'Leer productos', status: 'error', message: msg });
        }
        setResults([...tests]);

        // Test 4: Read ventas
        try {
            const { data, error } = await supabase.from('ventas').select('*');
            if (error) throw error;
            tests.push({
                name: 'Leer ventas',
                status: 'success',
                message: `${data.length} ventas encontradas`,
            });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            tests.push({ name: 'Leer ventas', status: 'error', message: msg });
        }
        setResults([...tests]);

        // Test 5: Read detalle_ventas
        try {
            const { data, error } = await supabase.from('detalle_ventas').select('*');
            if (error) throw error;
            tests.push({
                name: 'Leer detalle_ventas',
                status: 'success',
                message: `${data.length} registros encontrados`,
            });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            tests.push({ name: 'Leer detalle_ventas', status: 'error', message: msg });
        }
        setResults([...tests]);

        setRunning(false);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Test de Conexión</h1>
                <p className="text-sm text-surface-400 mt-1">
                    Verifica que la conexión a Supabase funcione correctamente.
                </p>
            </div>

            <div className="rounded-2xl bg-surface-800/80 border border-surface-700/50 p-6 space-y-4">
                <div className="text-sm text-surface-300 space-y-1">
                    <p><strong className="text-white">URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ No configurada'}</p>
                    <p><strong className="text-white">Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}</p>
                </div>

                <Button onClick={runTests} disabled={running}>
                    {running ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Ejecutando...
                        </>
                    ) : (
                        'Ejecutar Tests'
                    )}
                </Button>
            </div>

            {results.length > 0 && (
                <div className="rounded-2xl bg-surface-800/80 border border-surface-700/50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-surface-700/50">
                        <h3 className="font-semibold text-white">Resultados</h3>
                    </div>
                    <div className="divide-y divide-surface-700/30">
                        {results.map((test, i) => (
                            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                                {test.status === 'success' ? (
                                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                                ) : test.status === 'error' ? (
                                    <XCircle size={20} className="text-red-400 shrink-0" />
                                ) : (
                                    <Loader2 size={20} className="text-surface-400 animate-spin shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">{test.name}</p>
                                    <p className={`text-xs mt-0.5 ${test.status === 'error' ? 'text-red-400' : 'text-surface-400'}`}>
                                        {test.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {results.some((t) => t.status === 'error') && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                    <p className="text-sm text-amber-400 font-medium">⚠️ Si ves errores de permisos (RLS):</p>
                    <p className="text-xs text-surface-300 mt-2">
                        Necesitas agregar políticas RLS en el SQL Editor de Supabase.
                        Ejecuta el SQL para crear las políticas de acceso público.
                    </p>
                </div>
            )}
        </div>
    );
}
