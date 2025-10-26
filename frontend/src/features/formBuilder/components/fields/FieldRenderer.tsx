import type { FC } from 'react';
import type { FormField } from '../../types';
import CheckboxField from './CheckboxField';
import NumberField from './NumberField';
import RadioField from './RadioField';
import SelectField from './SelectField';
import TextField from './TextField';

interface FieldRendererProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  isSelected?: boolean;
}

const FieldRenderer: FC<FieldRendererProps> = ({
  field,
  onEdit,
  onDelete,
  isSelected = false,
}) => {
  const commonProps = {
    field,
    onEdit,
    onDelete,
    isSelected,
    key: field.id,
  };

  switch (field.type) {
    case 'number':
      return <NumberField {...commonProps} />;
    case 'select':
      return <SelectField {...commonProps} />;
    case 'radio':
      return <RadioField {...commonProps} />;
    case 'checkbox':
      return <CheckboxField {...commonProps} />;
    case 'text':
    default:
      return <TextField {...commonProps} />;
  }
};

export default FieldRenderer;
