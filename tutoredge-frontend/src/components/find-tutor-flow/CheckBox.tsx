import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 8,
        cursor: 'pointer',
      }}
    >
      <input type="checkbox" {...props} style={{ marginRight: 8 }} />
      {label}
    </label>
  );
};

export default Checkbox;
