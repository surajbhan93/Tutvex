import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

interface PasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border-gray-300 py-3 pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
