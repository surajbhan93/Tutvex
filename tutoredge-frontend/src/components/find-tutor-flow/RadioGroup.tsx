import React from 'react';

interface RadioGroupOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioGroupOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div>
      {options.map((option) => (
        <label
          key={option.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 8,
            cursor: 'pointer',
          }}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            style={{ marginRight: 8 }}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
