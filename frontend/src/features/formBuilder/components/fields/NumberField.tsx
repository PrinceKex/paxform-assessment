import { InputNumber } from 'antd';
import type { FC } from 'react';
import type { FormField } from '../../types';
import BaseField from './BaseField';

interface NumberFieldProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  isSelected?: boolean;
}

const NumberField: FC<NumberFieldProps> = ({ field, onEdit, onDelete, isSelected }) => {
  return (
    <BaseField 
      field={field} 
      onEdit={onEdit} 
      onDelete={onDelete}
      isSelected={isSelected}
    >
      <InputNumber 
        style={{ width: '100%' }}
        placeholder={field.placeholder || 'Enter a number...'}
        disabled={field.disabled}
        min={field.validation?.min}
        max={field.validation?.max}
        readOnly
      />
    </BaseField>
  );
};

export default NumberField;
