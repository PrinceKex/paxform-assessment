import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Space, Typography } from 'antd';
import type { FC } from 'react';
import type { FormField } from '../../types';

const { Text } = Typography;

interface BaseFieldProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  isSelected?: boolean;
  children: React.ReactNode;
}

const BaseField: FC<BaseFieldProps> = ({ 
  field, 
  onEdit, 
  onDelete, 
  isSelected = false,
  children 
}) => {
  return (
    <div 
      className={`form-field ${isSelected ? 'selected' : ''}`}
      style={{
        padding: '12px',
        border: `1px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
        borderRadius: '4px',
        marginBottom: '12px',
        backgroundColor: isSelected ? '#e6f7ff' : 'white',
        position: 'relative',
      }}
    >
      <Form.Item
        label={field.label}
        required={field.required}
        style={{ marginBottom: '8px' }}
      >
        {children}
      </Form.Item>
      <div 
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          opacity: isSelected ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(field)}
          />
          <Button 
            type="text" 
            danger 
            size="small" 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(field.id)}
          />
        </Space>
      </div>
      {field.description && (
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '-8px' }}>
          {field.description}
        </Text>
      )}
    </div>
  );
};

export default BaseField;
