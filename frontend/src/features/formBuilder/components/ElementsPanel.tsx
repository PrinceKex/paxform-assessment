import { useDraggable } from '@dnd-kit/core';
import { Button, Card, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import type { FieldType } from '../types';
import './ElementsPanel.css';

const { Text } = Typography;

interface FieldItemProps {
  type: FieldType;
  icon: React.ReactNode;
  label: string;
}

const FieldItem: React.FC<FieldItemProps> = ({ type, icon, label }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `field-${type}-${uuidv4()}`,
    data: { type, from: 'elements-panel' }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleDragStart = (e: React.DragEvent) => {
    console.group('=== DRAG START (ElementsPanel) ===');
    console.log('Dragging field:', { type, label });
    
    // Set both text/plain and application/json data formats
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.setData('application/json', JSON.stringify({
      type,
      from: 'elements-panel',
      timestamp: new Date().toISOString(),
      field: { type, label }
    }));
    
    e.dataTransfer.effectAllowed = 'copy';
    
    // Log the data being set
    console.log('DataTransfer data set:', {
      types: Array.from(e.dataTransfer.types),
      effectAllowed: e.dataTransfer.effectAllowed
    });
    
    // Add a custom drag image
    const dragImage = document.createElement('div');
    dragImage.textContent = label;
    dragImage.style.padding = '8px 16px';
    dragImage.style.background = 'white';
    dragImage.style.border = '1px solid #d9d9d9';
    dragImage.style.borderRadius = '4px';
    dragImage.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    dragImage.style.position = 'fixed';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    try {
      e.dataTransfer.setDragImage(dragImage, 10, 10);
      console.log('Drag image set successfully');
    } catch (error) {
      console.error('Error setting drag image:', error);
    }
    
    // Remove the temporary element after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
      console.log('Drag start completed');
      console.groupEnd();
    }, 0);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      draggable
      onDragStart={handleDragStart}
    >
      <Button 
        type="dashed" 
        icon={icon}
        className="field-item-button"
        style={{ 
          width: '100%',
          marginBottom: '8px',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          cursor: 'grab',
          userSelect: 'none'
        }}
      >
        {label}
      </Button>
    </div>
  );
};

const ElementsPanel: React.FC = () => {
  const fieldTypes: FieldItemProps[] = [
    { type: 'text', icon: <span>📝</span>, label: 'Text Input' },
    { type: 'number', icon: <span>🔢</span>, label: 'Number' },
    { type: 'email', icon: <span>✉️</span>, label: 'Email' },
    { type: 'select', icon: <span>🔽</span>, label: 'Dropdown' },
    { type: 'checkbox', icon: <span>☑️</span>, label: 'Checkbox' },
    { type: 'radio', icon: <span>🔘</span>, label: 'Radio Buttons' },
    { type: 'date', icon: <span>📅</span>, label: 'Date' },
  ];

  return (
    <Card 
      title="Form Elements" 
      size="small"
      style={{ 
        width: 250,
        height: '100%',
        overflowY: 'auto',
        position: 'sticky',
        top: '16px',
      }}
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
        Drag and drop fields to add them to your form
      </Text>
      {fieldTypes.map((field) => (
        <FieldItem key={field.type} {...field} />
      ))}
    </Card>
  );
};

export default ElementsPanel;
