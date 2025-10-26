import { Checkbox, Space } from 'antd';
import type { FC } from 'react';
import type { FormField } from '../../types';
import BaseField from './BaseField';

interface CheckboxFieldProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  isSelected?: boolean;
}

const CheckboxField: FC<CheckboxFieldProps> = ({ field, onEdit, onDelete, isSelected }) => {
  return (
    <BaseField 
      field={field} 
      onEdit={onEdit} 
      onDelete={onDelete}
      isSelected={isSelected}
    >
      <Checkbox.Group 
        disabled={field.disabled} 
        value={Array.isArray(field.defaultValue) ? field.defaultValue.filter((v): v is string | number => 
          typeof v === 'string' || typeof v === 'number'
        ) : []}
      >
        <Space direction="vertical">
          {field.options?.map((option) => (
            <Checkbox key={option.value} value={option.value}>
              {option.label}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    </BaseField>
  );
};

export default CheckboxField;
