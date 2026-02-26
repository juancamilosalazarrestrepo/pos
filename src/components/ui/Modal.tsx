'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Modal */}
            <div
                className={`relative w-full ${maxWidth} bg-surface-800 border border-surface-700 rounded-2xl shadow-2xl transform transition-all animate-in`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-surface-700">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                {/* Body */}
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}
