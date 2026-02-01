// import React from 'react';

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   children: React.ReactNode;
//   variant?: 'primary' | 'secondary';
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   variant = 'primary',
//   ...props
// }) => {
//   const baseStyle = 'px-4 py-2 rounded font-semibold cursor-pointer';
//   const variantStyle =
//     variant === 'primary'
//       ? 'bg-blue-600 text-white hover:bg-blue-700'
//       : 'bg-gray-300 text-black hover:bg-gray-400';

//   return (
//     <button className={`${baseStyle} ${variantStyle}`} {...props}>
//       {children}
//     </button>
//   );
// };

// export default Button;

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled,
  ...props
}) => {
  const baseStyle =
    'px-5 py-2 rounded-xl font-semibold transition-all duration-200';

  const variantStyle =
    variant === 'primary'
      ? 'bg-purple-600 text-white hover:bg-purple-700'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300';

  const disabledStyle = 'opacity-60 cursor-not-allowed';

  return (
    <button
      className={`
        ${baseStyle}
        ${variantStyle}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? disabledStyle : ''}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
};

export default Button;
