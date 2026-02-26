import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
}

export default function KPICard({
    title,
    value,
    icon: Icon,
    iconColor = 'text-primary-400',
    iconBg = 'bg-primary-500/15',
}: KPICardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-surface-800/80 border border-surface-700/50 p-5 hover:border-surface-600/50 transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-600/10 transition-all duration-500" />

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-2">
                    <p className="text-sm text-surface-400 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
                </div>
                <div className={cn('p-3 rounded-xl', iconBg)}>
                    <Icon size={24} className={iconColor} />
                </div>
            </div>
        </div>
    );
}
