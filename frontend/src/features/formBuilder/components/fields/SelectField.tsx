import { Select } from 'antd';
import type { FC } from 'react';
import type { FormField } from '../../types';
import BaseField from './BaseField';

const { Option } = Select;

interface SelectFieldProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  isSelected?: boolean;
}

const SelectField: FC<SelectFieldProps> = ({ field, onEdit, onDelete, isSelected }) => {
  return (
    <BaseField 
      field={field} 
      onEdit={onEdit} 
      onDelete={onDelete}
      isSelected={isSelected}
    >
      <Select
        style={{ width: '100%' }}
        placeholder={field.placeholder || 'Select an option...'}
        disabled={field.disabled}
        defaultValue={field.defaultValue}
        open={false}
      >
        {field.options?.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </BaseField>
  );
};

export default SelectField;
