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
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  );
};

export default FormField;