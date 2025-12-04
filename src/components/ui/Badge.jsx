import React from 'react'

export const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-stone-100 text-stone-700',
        primary: 'bg-amber-100 text-amber-800',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-orange-100 text-orange-800',
        danger: 'bg-red-100 text-red-800',
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    )
}
