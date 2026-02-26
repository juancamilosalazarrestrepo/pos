/**
 * Format a number as Colombian Pesos (COP).
 */
export function formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateStr));
}

/**
 * Generate a CSS class string from conditional classes.
 */
export function cn(...classes: (string | false | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Get emoji icon for a category name.
 */
export function getCategoryEmoji(categoryName: string): string {
    const map: Record<string, string> = {
        'Bebidas': '🥤',
        'Snacks': '🍪',
        'Lácteos': '🥛',
        'Panadería': '🍞',
        'Limpieza': '🧹',
        'Cuidado Personal': '🧴',
        'Enlatados': '🥫',
        'Granos': '🌾',
        'Frutas y Verduras': '🍌',
        'Otros': '📦',
    };
    return map[categoryName] || '📦';
}
