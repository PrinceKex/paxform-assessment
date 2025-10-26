import { LogoutOutlined, PlusOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, message, Result, Tooltip, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../app/store';
import ErrorBoundary from '../../../components/ErrorBoundary';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useAuth } from '../../../features/auth/useAuth';
import { addField, addSection, moveElement, removeSection, updateSection } from '../formBuilderSlice';
import type { FieldType, FormField, FormGroup, FormSection } from '../types';
import ElementsPanel from './ElementsPanel';
import Section from './Section';

const { Title } = Typography;

// Helper function to safely get sections with default empty array
const getSafeSections = (state: RootState) => ({
  sections: state.formBuilder?.sections || [],
  status: state.formBuilder?.status || 'idle',
  error: state.formBuilder?.error || null,
});

export default function FormBuilder() {
  // State hooks must be called at the top level
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDraggingFromPanel, setIsDraggingFromPanel] = useState(false);
  const [activeDragData, setActiveDragData] = useState<{ type: string; from: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Configure sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require the mouse to move by 5 pixels before activating
      },
    })
  );
  
  // Other hooks
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { sections, status, error } = useSelector(getSafeSections);
  
  // Debug effect to log when sections change
  useEffect(() => {
    console.log('Sections updated:', sections.map(s => ({ id: s.id, title: s.title })));
  }, [sections]);

  // Helper function to create default field with proper typing
  const createDefaultField = useCallback((type: FieldType): Omit<FormField, 'id'> => {
    const baseField = {
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      disabled: false,
    };

    if (['select', 'radio', 'checkbox'].includes(type)) {
      return {
        ...baseField,
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]
      };
    }

    return baseField;
  }, []);

  // Handle adding a new field to a section
  const handleAddField = useCallback((sectionId: string, field: FieldType | Omit<FormField, 'id'>, position?: number) => {
    console.group('=== HANDLE ADD FIELD ===');
    console.log('Section ID:', sectionId);
    console.log('Field data:', field);
    console.log('Position:', position);
    
    const section = sections.find(s => s.id === sectionId);
    if (!section || section.groups.length === 0) {
      const errorMsg = !section ? 'Section not found' : 'No groups in section';
      console.error('Failed to add field:', errorMsg, { sectionId, section });
      message.error('No valid section or group found');
      console.groupEnd();
      return;
    }

    const groupId = section.groups[0].id;
    console.log('Using group ID:', groupId);
    
    const fieldToAdd = typeof field === 'string' ? createDefaultField(field) : field;
    console.log('Field to add:', fieldToAdd);

    try {
      console.log('Dispatching addField action...');
      dispatch(addField({
        sectionId,
        groupId,
        field: fieldToAdd,
        position: position ?? 0
      }));

      console.log('Field added successfully');
      message.success(`${fieldToAdd.type} field added`);
    } catch (error) {
      console.error('Error adding field:', error);
      message.error('Failed to add field');
    }
    
    console.groupEnd();
  }, [dispatch, sections, createDefaultField]);

  // Validate if a drop target is valid
  interface DropTarget {
    id: string;
    data: {
      current?: {
        type?: string;
        from?: string;
        sectionId?: string;
        sortable?: {
          index: number;
        };
      };
    };
  }

  const isValidDropTarget = useCallback((over: DropTarget | null): boolean => {
    console.group('=== VALIDATE DROP TARGET ===');
    console.log('Over target:', {
      id: over?.id,
      data: over?.data.current,
      isValid: !!over
    });
    
    if (!over) {
      console.log('Invalid: No drop target');
      console.groupEnd();
      return false;
    }
    
    // If dragging from panel, allow dropping on sections or section content
    if (isDraggingFromPanel) {
      const isSection = Boolean(
        over.data.current?.type === 'section' || 
        over.data.current?.from === 'section' ||
        over.data.current?.sectionId // Allow dropping on section content
      );
      
      console.log(`Dragging from panel - Valid drop target: ${isSection}`, {
        overType: over.data.current?.type,
        overFrom: over.data.current?.from,
        sectionId: over.data.current?.sectionId,
        allData: over.data.current
      });
      
      console.groupEnd();
      return isSection;
    }
    
    // For other drag operations (reordering), allow dropping on sortable containers
    const isSortable = Boolean(over.data.current?.sortable);
    console.log(`Reordering - Valid drop target: ${isSortable}`, {
      overData: over.data.current
    });
    console.groupEnd();
    return isSortable;
  }, [isDraggingFromPanel]);
  
  // Handle drag start event
  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.group('=== FORM BUILDER DRAG START ===');
    const activeElementData = {
      id: event.active.id,
      data: event.active.data.current,
      rect: event.active.rect.current
    };
    console.log('Active element:', activeElementData);
    
    const { active } = event;
    setActiveId(active.id as string);
    
    if (active.data.current?.type === 'field' && active.data.current?.from === 'elements-panel') {
      const dragData = {
        fieldType: active.data.current.fieldType,
        activeData: active.data.current,
        activeId: active.id
      };
      console.log('Dragging new field from elements panel:', dragData);
      
      setIsDraggingFromPanel(true);
      setActiveDragData({
        type: active.data.current.fieldType,
        from: 'panel'
      });
    } else {
      const dragData = {
        id: active.id,
        type: active.data.current?.type || 'unknown',
        from: active.data.current?.from || 'unknown',
        data: active.data.current
      };
      console.log('Dragging existing element:', dragData);
      
      setIsDraggingFromPanel(false);
      setActiveDragData(null);
    }
    
    console.groupEnd();
  }, []);
  
  // Handle drag end event
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    console.group('=== DRAG END ===');
    console.log('Active element:', {
      id: event.active.id,
      data: event.active.data.current,
      rect: event.active.rect.current
    });
    console.log('Over element:', {
      id: event.over?.id,
      data: event.over?.data.current,
      rect: event.over?.rect
    });
    
    const { active, over } = event;
    
    // Reset drag state
    setActiveId(null);
    
    // Validate drop target
    const isValid = over && isValidDropTarget(over as DropTarget);
    console.log('Is valid drop target:', isValid);
    
    if (!isValid) {
      console.log('Invalid drop target, aborting drag operation');
      setActiveDragData(null);
      console.groupEnd();
      return;
    }
    
    // Handle cancel or no movement
    if (active.id === over.id) {
      console.log('Drag cancelled or no movement detected');
      setActiveDragData(null);
      console.groupEnd();
      return;
    }

    // Handle field addition from panel
    if (isDraggingFromPanel && activeDragData?.type) {
      console.log('Adding new field:', {
        type: activeDragData.type,
        toSection: over.id,
        overData: over.data.current
      });
      handleAddField(over.id as string, activeDragData.type as FieldType);
      setActiveDragData(null);
      console.groupEnd();
      return;
    }
    
    // Handle reordering of existing elements
    const sourceId = active.id as string;
    const destinationId = over.id as string;
    
    console.log('Reordering elements:', {
      sourceId,
      destinationId,
      activeData: active.data.current,
      overData: over.data.current
    });
    
    // Find source and destination indices
    let sourceSectionIndex = -1;
    let sourceGroupIndex: number | undefined;
    let sourceFieldIndex: number | undefined;
    
    // Find source element in sections
    sections.forEach((section: FormSection, sIdx: number) => {
      if (section.id === sourceId) {
        sourceSectionIndex = sIdx;
        return;
      }
      
      section.groups.forEach((group: FormGroup, gIdx: number) => {
        if (group.id === sourceId) {
          sourceSectionIndex = sIdx;
          sourceGroupIndex = gIdx;
          return;
        }
        
        group.fields.forEach((field: FormField, fIdx: number) => {
          if (field.id === sourceId) {
            sourceSectionIndex = sIdx;
            sourceGroupIndex = gIdx;
            sourceFieldIndex = fIdx;
          }
        });
      });
    });
    
    // Find destination element in sections
    let destSectionIndex = -1;
    let destGroupIndex: number | undefined;
    let destFieldIndex: number | undefined;
    
    sections.forEach((section: FormSection, sIdx: number) => {
      if (section.id === destinationId) {
        destSectionIndex = sIdx;
        return;
      }
      
      section.groups.forEach((group: FormGroup, gIdx: number) => {
        if (group.id === destinationId) {
          destSectionIndex = sIdx;
          destGroupIndex = gIdx;
          return;
        }
        
        group.fields.forEach((field: FormField, fIdx: number) => {
          if (field.id === destinationId) {
            destSectionIndex = sIdx;
            destGroupIndex = gIdx;
            destFieldIndex = fIdx;
          }
        });
      });
    });
    
    // If we couldn't find the source or destination, bail out
    if (sourceSectionIndex === -1 || destSectionIndex === -1) {
      console.error('Could not find source or destination:', {
        sourceSectionIndex,
        destSectionIndex,
        sourceId,
        destinationId,
        sections: sections.map(s => ({ id: s.id, title: s.title }))
      });
      setActiveDragData(null);
      console.groupEnd();
      return;
    }
    
    // Determine the drop position
    const position: 'after' | 'before' | 'inside' = 
      over.data.current?.sortable?.index > active.data.current?.sortable?.index 
        ? 'after' 
        : 'before';
    
    const movePayload = {
      source: {
        sectionIndex: sourceSectionIndex,
        groupIndex: sourceGroupIndex,
        fieldIndex: sourceFieldIndex
      },
      destination: {
        sectionIndex: destSectionIndex,
        groupIndex: destGroupIndex,
        fieldIndex: destFieldIndex,
        position
      }
    };
    
    console.log('Dispatching moveElement with payload:', JSON.parse(JSON.stringify(movePayload)));
    
    // Dispatch the moveElement action
    dispatch(moveElement(movePayload));
    
    setActiveDragData(null);
    console.log('Drag operation completed successfully');
    console.groupEnd();
  }, [sections, isDraggingFromPanel, activeDragData, handleAddField, dispatch, isValidDropTarget]);
  const handleAddSection = useCallback(() => {
    dispatch(addSection({ title: 'New Section' }));
    message.success('Section added');
  }, [dispatch]);

  const handleEditSection = useCallback((section: FormSection) => {
    const newTitle = prompt('Enter section title:', section.title);
    if (newTitle && newTitle !== section.title) {
      const updates: Partial<FormSection> = {
        title: newTitle,
        groups: section.groups,
        // Include any other properties from FormSection that should be preserved
      };
      
      dispatch(updateSection({ 
        id: section.id,
        updates
      }));
      message.success('Section updated');
    }
  }, [dispatch]);

  const handleDeleteSection = useCallback((sectionId: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      dispatch(removeSection(sectionId));
      message.success('Section deleted');
    }
  }, [dispatch]);

  // Handle loading and error states at the component level
  const renderContent = () => {
    if (status === 'loading') {
      return <LoadingSpinner fullscreen tip="Loading form builder..." />;
    }
    
    if (status === 'failed') {
      return (
        <div style={{ padding: '24px' }}>
          <Result
            status="error"
            title="Failed to load form builder"
            subTitle={error || 'An error occurred while loading the form builder.'}
            extra={[
              <Button
                key="reload"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>,
            ]}
          />
        </div>
      );
    }
    
    // Main content when not loading or in error state
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Title level={3} style={{ margin: 0, display: 'inline-block', marginRight: '16px' }}>
              Form Builder
              <Tooltip title="Drag and drop fields from the left panel to build your form">
                <QuestionCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
              </Tooltip>
            </Title>
            <span style={{ color: '#666', fontSize: '14px' }}>
              <UserOutlined /> {user?.name || 'User'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type="primary"
              onClick={handleSaveForm}
              loading={isSaving}
              disabled={sections.length === 0}
            >
              {isSaving ? 'Saving...' : 'Save Form'}
            </Button>
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              title="Logout"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>
          <div style={{ flex: '0 0 250px', borderRight: '1px solid #f0f0f0', paddingRight: '16px' }}>
            <ElementsPanel />
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              autoScroll={false}
            >
              <SortableContext 
                items={sections.map((section: FormSection) => section.id)} 
                strategy={verticalListSortingStrategy}
              >
                {sections.map((section: FormSection) => (
                  <Section
                    key={section.id}
                    section={section}
                    onEdit={handleEditSection}
                    onDelete={handleDeleteSection}
                    onAddField={handleAddField}
                    selectedFieldId={activeId}
                  />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeId ? (
                  <div style={{ 
                    background: '#fff', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    width: '200px'
                  }}>
                    {isDraggingFromPanel ? (
                      <div style={{ 
                        padding: '8px 16px', 
                        background: '#f0f7ff', 
                        borderRadius: '4px' 
                      }}>
                        New {activeDragData?.type} Field
                      </div>
                    ) : (
                      <div style={{ opacity: 0.8 }}>
                        {sections.find((s: FormSection) => s.id === activeId)?.title || 'Section'}
                      </div>
                    )}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
        
            {sections.length === 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                border: '2px dashed #d9d9d9',
                borderRadius: '8px',
                marginTop: '16px'
              }}>
                <p style={{ color: '#8c8c8c', marginBottom: '16px' }}>
                  Drag fields from the left panel to start building your form
                </p>
                <Button
                  type="primary"
                  onClick={() => handleAddSection()}
                  icon={<PlusOutlined />}
                >
                  Add First Section
                </Button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }; 

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      message.error('Failed to logout');
    }
  };

  const handleSaveForm = useCallback(async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Form saved successfully!');
    } catch (err) {
      console.error('Failed to save form:', err);
      message.error('Failed to save form. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Status checks are now handled in the renderContent function

  // Remove the duplicate status check at the bottom of the file
  return (
    <ErrorBoundary>
      <div className="form-builder" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', height: '100%' }}>
        {renderContent()}
      </div>
    </ErrorBoundary>
  );
}
