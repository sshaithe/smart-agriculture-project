import React from 'react';
import Label from '../atom/Label';
import Input from '../atom/Input';

const FormField = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className='h-10 px-3 w-full border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow placeholder-gray-400'
      />
    </div>
  );
};

export default FormField;