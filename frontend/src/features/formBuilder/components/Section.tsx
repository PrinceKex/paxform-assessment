import { DeleteOutlined, DragOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, Space, Typography } from 'antd';
import type { CSSProperties } from 'react';
import { useCallback } from 'react';
import type { FieldType, FormField, FormSection } from '../types';
import FieldRenderer from './fields/FieldRenderer';

const { Title } = Typography;

interface SectionProps {
  section: FormSection;
  onEdit?: (section: FormSection) => void;
  onDelete?: (sectionId: string) => void;
  onAddField?: (sectionId: string, field: Omit<FormField, 'id'>) => void;
  onEditField?: (sectionId: string, field: FormField) => void;
  onDeleteField?: (sectionId: string, fieldId: string) => void;
  selectedFieldId?: string | null;
  isDragging?: boolean;
}

function Section({ 
  section, 
  onEdit, 
  onDelete, 
  onAddField, 
  onEditField, 
  onDeleteField,
  selectedFieldId,
  isDragging
}: SectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
    setActivatorNodeRef,
  } = useSortable({ 
    id: section.id,
    data: {
      type: 'section',
      section,
    },
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging || isSorting ? 'none' : (transition || undefined),
    opacity: isDragging || isSorting ? 0.8 : 1,
    position: 'relative',
    zIndex: isSorting ? 1 : 'auto',
    marginBottom: '16px',
    boxShadow: isSorting ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
  };

  const createDefaultField = useCallback(<T extends FieldType>(type: T): Omit<FormField, 'id'> => {
    const baseField = {
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      description: '',
      placeholder: `Enter ${type.toLowerCase()}`,
      disabled: false
    };

    // Add type-specific properties
    if (['select', 'radio'].includes(type)) {
      return {
        ...baseField,
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' }
        ]
      };
    }

    return baseField;
  }, []);

  const handleAddField = useCallback((sectionId: string, field: Omit<FormField, 'id'> | FieldType) => {
    // If field is a FieldType (from drag event), create a default field config
    const fieldToAdd = typeof field === 'string' 
      ? createDefaultField(field)
      : field;
      
    onAddField?.(sectionId, fieldToAdd);
  }, [onAddField, createDefaultField]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    console.group('=== SECTION DROP EVENT ===');
    console.log('Drop event:', {
      target: e.target,
      currentTarget: e.currentTarget,
      dataTransfer: {
        types: Array.from(e.dataTransfer.types),
        items: Array.from(e.dataTransfer.items).map(item => ({
          kind: item.kind,
          type: item.type,
        })),
        files: e.dataTransfer.files,
        data: {
          text: e.dataTransfer.getData('text/plain'),
          json: (() => {
            try {
              return JSON.parse(e.dataTransfer.getData('application/json'));
            } catch {
              return 'No JSON data';
            }
          })(),
        },
      },
    });

    e.preventDefault();
    
    // Get all available data types from the drag event
    const fieldType = e.dataTransfer.getData('text/plain') as FieldType;
    const jsonData = (() => {
      try {
        return JSON.parse(e.dataTransfer.getData('application/json'));
      } catch {
        return null;
      }
    })();
    
    console.log('Extracted drop data:', { fieldType, jsonData });
    
    // Validate that the fieldType is a valid FieldType
    const validFieldTypes: FieldType[] = [
      'text', 'number', 'email', 'password', 'textarea', 
      'select', 'checkbox', 'radio', 'date'
    ];
    
    if (fieldType && validFieldTypes.includes(fieldType as FieldType)) {
      console.log(`Adding field of type: ${fieldType} to section: ${section.id}`);
      handleAddField(section.id, fieldType as FieldType);
    } else {
      console.warn('Invalid field type or no field type found in drop data', {
        fieldType,
        validFieldTypes,
        dataTransferTypes: Array.from(e.dataTransfer.types),
        jsonData
      });
    }
    
    console.groupEnd();
  }, [handleAddField, section.id]);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              type="text" 
              icon={<DragOutlined />} 
              {...listeners}
              ref={setActivatorNodeRef}
              style={{ 
                marginRight: 8, 
                cursor: isDragging ? 'grabbing' : 'grab',
                opacity: isDragging ? 0.7 : 1,
              }}
              onMouseDown={(e) => {
                // Prevent the button from stealing focus
                e.preventDefault();
                e.stopPropagation();
              }}
            />
            <Title level={4} style={{ margin: 0 }}>{section.title}</Title>
          </div>
        }
        extra={
          <Space>
            <Button 
              type="text" 
              icon={<PlusOutlined />} 
              onClick={() => handleAddField(section.id, {
                type: 'text',
                label: 'New Field',
                required: false
              })}
            >
              Add Field
            </Button>
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit?.(section)}
            />
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => onDelete?.(section.id)}
            />
          </Space>
        }
      >
        {section.description && <p>{section.description}</p>}
        <div 
          className="section-content"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            minHeight: '100px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px dashed transparent',
            transition: 'all 0.2s',
          }}
          onDragEnter={(e) => {
            e.currentTarget.style.borderColor = '#1890ff';
            e.currentTarget.style.backgroundColor = '#f0f7ff';
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {section.groups[0]?.fields?.length ? (
            section.groups[0].fields.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                onEdit={(field) => onEditField?.(section.id, field)}
                onDelete={(fieldId) => onDeleteField?.(section.id, fieldId)}
                isSelected={selectedFieldId === field.id}
              />
            ))
          ) : (
            <div 
              style={{ 
                padding: '24px',
                border: '2px dashed #d9d9d9',
                borderRadius: '4px',
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDragging ? '#f0f7ff' : '#fafafa',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
              onClick={() => handleAddField(section.id, {
                type: 'text',
                label: 'New Text Field',
                required: false,
              })}
            >
              <p style={{ color: '#8c8c8c', margin: '0 0 8px 0', fontSize: '14px' }}>
                Click to add a text field
              </p>
              <p style={{ color: '#bfbfbf', margin: 0, fontSize: '12px' }}>
                or drag and drop a field type here
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Section;
