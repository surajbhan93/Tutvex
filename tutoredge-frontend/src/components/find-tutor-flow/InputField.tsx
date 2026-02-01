import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, error, ...props }) => {
  return (
    <div style={{ marginBottom: 15 }}>
      {label && (
        <label style={{ display: 'block', marginBottom: 5, fontWeight: 600 }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: 4,
          border: error ? '1px solid red' : '1px solid #ccc',
          fontSize: 16,
        }}
      />
      {error && (
        <p style={{ color: 'red', marginTop: 4, fontSize: 13 }}>{error}</p>
      )}
    </div>
  );
};

export default InputField;
