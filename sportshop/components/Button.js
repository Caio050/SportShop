import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'w-full py-3 px-4 rounded-lg transition-all';
  const variantClasses =
    variant === 'primary'
      ? 'bg-primary text-white hover:bg-[#c40500] shadow-lg shadow-primary/20'
      : 'bg-secondary text-white hover:bg-[#2A2A2A]';

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
} 