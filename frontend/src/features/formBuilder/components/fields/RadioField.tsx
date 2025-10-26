import { Radio, Space } from 'antd';
import type { FC } from 'react';
import type { FormField } from '../../types';
import BaseField from './BaseField';

interface RadioFieldProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  isSelected?: boolean;
}

const RadioField: FC<RadioFieldProps> = ({ field, onEdit, onDelete, isSelected }) => {
  return (
    <BaseField 
      field={field} 
      onEdit={onEdit} 
      onDelete={onDelete}
      isSelected={isSelected}
    >
      <Radio.Group disabled={field.disabled} value={field.defaultValue}>
        <Space direction="vertical">
          {field.options?.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </BaseField>
  );
};

export default RadioField;
