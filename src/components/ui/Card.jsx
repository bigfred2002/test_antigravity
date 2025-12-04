import React from 'react'

export const Card = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden ${className}`} {...props}>
            {children}
        </div>
    )
}

export const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-stone-100 ${className}`}>{children}</div>
)

export const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>{children}</div>
)

export const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 bg-stone-50 border-t border-stone-100 ${className}`}>{children}</div>
)
