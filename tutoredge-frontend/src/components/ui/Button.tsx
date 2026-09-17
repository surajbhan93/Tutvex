import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'dark'; // Add a variant prop
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary', // Default to 'primary'
  ...props
}) => {
  const baseClasses =
    'flex items-center justify-center rounded-xl font-bold leading-normal tracking-[-0.015em] transition-colors duration-200';

  // Define styles for each variant
  const variantClasses = {
    primary:
      'bg-[#177ccc] text-white hover:bg-[#1262a6] h-10 px-4 text-sm sm:h-12 sm:px-5 sm:text-base',
    dark: 'bg-gray-900 text-white hover:bg-gray-700 h-10 px-6 py-3 text-sm rounded-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Button;
