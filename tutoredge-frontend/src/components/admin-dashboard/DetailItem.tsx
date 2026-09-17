import React from 'react';

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
};

export default DetailItem;
