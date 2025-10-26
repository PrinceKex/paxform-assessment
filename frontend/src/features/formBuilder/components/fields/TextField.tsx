import { Input } from 'antd';
import type { FC } from 'react';
import type { FormField } from '../../types';
import BaseField from './BaseField';

interface TextFieldProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  isSelected?: boolean;
}

const TextField: FC<TextFieldProps> = ({ field, onEdit, onDelete, isSelected }) => {
  return (
    <BaseField 
      field={field} 
      onEdit={onEdit} 
      onDelete={onDelete}
      isSelected={isSelected}
    >
      <Input 
        placeholder={field.placeholder || 'Enter text...'}
        disabled={field.disabled}
        readOnly
      />
    </BaseField>
  );
};

export default TextField;
