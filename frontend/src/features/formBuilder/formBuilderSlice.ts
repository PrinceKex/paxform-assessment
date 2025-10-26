import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { formService, type FormData as ApiFormData } from '../../api/formService';
import type { FormBuilderState } from './formBuilderTypes';
import type { DropPosition, FormField, FormGroup, FormSection } from './types';

type ApiError = {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

export const initialState: FormBuilderState = {
  forms: [],
  currentForm: null,
  sections: [],
  status: 'idle',
  error: null,
  selectedElement: null,
  activeSectionId: null,
  activeGroupId: null,
  activeFieldId: null,
};

// Async thunks
export const fetchForms = createAsyncThunk<ApiFormData[]>(
  'formBuilder/fetchForms',
  async (_, { rejectWithValue }) => {
    try {
      return await formService.getForms();
    } catch (error) {
      const err = error as ApiError;
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch forms');
    }
  }
);

export const fetchFormById = createAsyncThunk<ApiFormData, string>(
  'formBuilder/fetchFormById',
  async (id, { rejectWithValue }) => {
    try {
      return await formService.getForm(id);
    } catch (error) {
      const err = error as ApiError;
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch form');
    }
  }
);

export const saveForm = createAsyncThunk<ApiFormData, Partial<ApiFormData>, { state: { formBuilder: FormBuilderState } }>(
  'formBuilder/saveForm',
  async (formData: Partial<ApiFormData>, { getState, rejectWithValue }) => {
    const state = getState();
    const currentForm = state.formBuilder.currentForm;
    
    try {
      if (currentForm?.id) {
        return await formService.updateForm(currentForm.id, {
          ...currentForm,
          title: formData.title ?? currentForm.title,
          description: formData.description ?? currentForm.description,
          structure: state.formBuilder.sections,
        });
      } else {
        // Ensure we have a title and description for new forms
        const formTitle = 'title' in formData ? formData.title : 'Untitled Form';
        const formDescription = 'description' in formData ? formData.description : '';
        
        return await formService.createForm({
          title: formTitle || 'Untitled Form',
          description: formDescription || '',
          structure: state.formBuilder.sections,
          is_published: false,
        });
      }
    } catch (error) {
      const err = error as ApiError;
      return rejectWithValue(err.response?.data?.message || 'Failed to save form');
    }
  }
);

export const deleteForm = createAsyncThunk<string, string>(
  'formBuilder/deleteForm',
  async (id, { rejectWithValue }) => {
    try {
      await formService.deleteForm(id);
      return id;
    } catch (error) {
      const err = error as ApiError;
      return rejectWithValue(err.response?.data?.message || 'Failed to delete form');
    }
  }
);

export const togglePublishForm = createAsyncThunk<ApiFormData, string, { rejectValue: string }>(
  'forms/togglePublish',
  async (id, { rejectWithValue }) => {
    try {
      return await formService.togglePublish(id);
    } catch (error) {
      const err = error as ApiError;
      return rejectWithValue(err.response?.data?.message || 'Failed to update form status');
    }
  }
);

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    // Section actions
    addSection(state, action: PayloadAction<{ title: string; position?: number }>) {
      const { title, position } = action.payload;
      
      // Create a default group for the new section
      const defaultGroup: FormGroup = {
        id: `group-${uuidv4()}`,
        title: 'Default Group',
        fields: []
      };
      
      const newSection: FormSection = {
        id: `section-${uuidv4()}`,
        title,
        description: '',
        groups: [defaultGroup], // Initialize with the default group
      };

      // Ensure sections array exists
      if (!state.sections) {
        state.sections = [];
      }

      if (typeof position === 'number' && position >= 0 && position <= state.sections.length) {
        state.sections.splice(position, 0, newSection);
      } else {
        state.sections.push(newSection);
      }
      
      console.log('Added new section with default group:', {
        sectionId: newSection.id,
        groupId: defaultGroup.id,
        section: newSection
      });
    },

    updateSection: (state, action: PayloadAction<{ id: string; updates: Partial<FormSection> }>) => {
      const { id, updates } = action.payload;
      const sectionIndex = state.sections.findIndex(section => section.id === id);
      if (sectionIndex !== -1) {
        state.sections[sectionIndex] = { ...state.sections[sectionIndex], ...updates };
      }
    },

    removeSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter(section => section.id !== action.payload);
    },

    // Group actions
    addGroup: (state, action: PayloadAction<{ sectionId: string; title: string; position?: number }>) => {
      const { sectionId, title, position } = action.payload;
      const sectionIndex = state.sections.findIndex(section => section.id === sectionId);
      
      if (sectionIndex !== -1) {
        const newGroup: FormGroup = {
          id: `group-${uuidv4()}`,
          title,
          fields: [],
        };

        if (typeof position === 'number') {
          state.sections[sectionIndex].groups.splice(position, 0, newGroup);
        } else {
          state.sections[sectionIndex].groups.push(newGroup);
        }
      }
    },

    updateGroup: (state, action: PayloadAction<{ sectionId: string; groupId: string; updates: Partial<FormGroup> }>) => {
      const { sectionId, groupId, updates } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        const groupIndex = section.groups.findIndex(g => g.id === groupId);
        if (groupIndex !== -1) {
          section.groups[groupIndex] = { ...section.groups[groupIndex], ...updates };
        }
      }
    },

    removeGroup: (state, action: PayloadAction<{ sectionId: string; groupId: string }>) => {
      const { sectionId, groupId } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        section.groups = section.groups.filter(group => group.id !== groupId);
      }
    },

    // Field actions
    addField: (
      state,
      action: PayloadAction<{
        sectionId: string;
        groupId: string;
        field: Omit<FormField, 'id'>;
        position?: number;
      }>
    ) => {
      const { sectionId, groupId, field, position } = action.payload;
      
      // Find the section index
      const sectionIndex = state.sections.findIndex(s => s.id === sectionId);
      if (sectionIndex === -1) return;
      
      // Create a new sections array with the updated section
      const sections = [...state.sections];
      const section = { ...sections[sectionIndex] };
      
      // Find the group index
      const groupIndex = section.groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return;
      
      // Create a new groups array with the updated group
      const groups = [...section.groups];
      const group = { ...groups[groupIndex] };
      
      // Create the new field with a unique ID
      const newField: FormField = {
        ...field,
        id: `field-${uuidv4()}`,
      };
      
      // Create a new fields array with the new field
      const fields = [...group.fields];
      if (typeof position === 'number' && position >= 0 && position <= fields.length) {
        fields.splice(position, 0, newField);
      } else {
        fields.push(newField);
      }
      
      // Update the group, section, and state
      group.fields = fields;
      groups[groupIndex] = group;
      section.groups = groups;
      sections[sectionIndex] = section;
      
      // Update the state with the new sections array
      state.sections = sections;
    },

    updateField: (
      state,
      action: PayloadAction<{
        sectionId: string;
        groupId: string;
        fieldId: string;
        updates: Partial<FormField>;
      }>
    ) => {
      const { sectionId, groupId, fieldId, updates } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        const group = section.groups.find(g => g.id === groupId);
        if (group) {
          const fieldIndex = group.fields.findIndex(f => f.id === fieldId);
          if (fieldIndex !== -1) {
            group.fields[fieldIndex] = { ...group.fields[fieldIndex], ...updates };
          }
        }
      }
    },

    removeField: (state, action: PayloadAction<{ sectionId: string; groupId: string; fieldId: string }>) => {
      const { sectionId, groupId, fieldId } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        const group = section.groups.find(g => g.id === groupId);
        if (group) {
          group.fields = group.fields.filter(field => field.id !== fieldId);
        }
      }
    },

    // Selection actions
    selectElement: (
      state,
      action: PayloadAction<{
        elementId: string;
        elementType: 'section' | 'group' | 'field';
        sectionId?: string;
        groupId?: string;
      }>
    ) => {
      const { elementId, elementType, sectionId, groupId } = action.payload;
      state.selectedElement = elementId;
      state.activeSectionId = elementType === 'section' ? elementId : sectionId || null;
      state.activeGroupId = elementType === 'group' ? elementId : groupId || null;
      state.activeFieldId = elementType === 'field' ? elementId : null;
    },

    clearSelection: (state) => {
      state.selectedElement = null;
      state.activeSectionId = null;
      state.activeGroupId = null;
      state.activeFieldId = null;
    },

    // Reorder actions
    moveElement: (
      state: FormBuilderState,
      action: PayloadAction<{
        source: { sectionIndex: number; groupIndex?: number; fieldIndex?: number };
        destination: DropPosition;
      }>
    ) => {
      const { source, destination } = action.payload;
      
      // Validate source indices
      if (
        source.sectionIndex < 0 || 
        source.sectionIndex >= state.sections.length ||
        (source.groupIndex !== undefined && (
          source.groupIndex < 0 ||
          source.groupIndex >= state.sections[source.sectionIndex].groups.length
        )) ||
        (source.fieldIndex !== undefined && (
          source.groupIndex === undefined ||
          source.fieldIndex < 0 ||
          source.fieldIndex >= state.sections[source.sectionIndex].groups[source.groupIndex].fields.length
        ))
      ) {
        console.error('Invalid source indices:', source);
        return;
      }
      
      // Validate destination indices
      if (
        destination.sectionIndex === undefined ||
        destination.sectionIndex < 0 ||
        destination.sectionIndex > state.sections.length ||
        (destination.groupIndex !== undefined && (
          destination.groupIndex < 0 ||
          (destination.sectionIndex < state.sections.length && 
           destination.groupIndex > state.sections[destination.sectionIndex].groups.length)
        )) ||
        (destination.fieldIndex !== undefined && (
          destination.groupIndex === undefined ||
          destination.fieldIndex < 0 ||
          (destination.sectionIndex < state.sections.length &&
           destination.groupIndex < state.sections[destination.sectionIndex].groups.length &&
           destination.fieldIndex > state.sections[destination.sectionIndex].groups[destination.groupIndex].fields.length)
        ))
      ) {
        console.error('Invalid destination indices:', destination);
        return;
      }
      
      // Clone the sections array to avoid direct state mutation
      const newSections = [...state.sections];
      
      // Handle moving sections
      if (source.groupIndex === undefined && source.fieldIndex === undefined) {
        // Moving a section
        const [movedSection] = newSections.splice(source.sectionIndex, 1);
        
        // Calculate the target position based on the drop position
        let targetPosition = destination.sectionIndex;
        if (destination.position === 'after' && targetPosition > source.sectionIndex) {
          targetPosition--; // Adjust for the removed item
        }
        
        // Insert the moved section at the target position
        newSections.splice(targetPosition, 0, movedSection);
      } 
      // Handle moving groups within sections
      else if (source.groupIndex !== undefined && source.fieldIndex === undefined) {
        // Get the source section and groups
        const sourceSection = { ...newSections[source.sectionIndex] };
        const sourceGroups = [...sourceSection.groups];
        
        // Remove the group from its original position
        const [movedGroup] = sourceGroups.splice(source.groupIndex, 1);
        
        // If moving within the same section
        if (source.sectionIndex === destination.sectionIndex) {
          // Calculate the target position
          let targetPosition = destination.groupIndex ?? 0;
          if (destination.position === 'after' && (destination.groupIndex ?? 0) > source.groupIndex) {
            targetPosition--; // Adjust for the removed item
          }
          
          // Insert the moved group at the target position
          sourceGroups.splice(targetPosition, 0, movedGroup);
          
          // Update the section with the new groups
          newSections[source.sectionIndex] = {
            ...sourceSection,
            groups: sourceGroups
          };
        }
      }
      // Handle moving fields
      else if (source.groupIndex !== undefined && source.fieldIndex !== undefined) {
        // Get the source section, groups, and fields
        const sourceSection = { ...newSections[source.sectionIndex] };
        const sourceGroups = [...sourceSection.groups];
        const sourceGroup = { ...sourceGroups[source.groupIndex] };
        const sourceFields = [...sourceGroup.fields];
        
        // Remove the field from its original position
        const [movedField] = sourceFields.splice(source.fieldIndex, 1);
        
        // If moving to a different group
        if (destination.groupIndex !== undefined && destination.groupIndex !== source.groupIndex) {
          // Get the destination group and fields
          const destSection = newSections[destination.sectionIndex];
          const destGroups = [...destSection.groups];
          const destGroup = { ...destGroups[destination.groupIndex] };
          const destFields = [...destGroup.fields];
          
          // Calculate the target position
          let targetPosition = destination.fieldIndex ?? destFields.length;
          if (destination.position === 'after' && destination.fieldIndex !== undefined) {
            targetPosition++;
          }
          
          // Insert the field in the destination group
          destFields.splice(targetPosition, 0, movedField);
          
          // Update the destination group and section
          destGroup.fields = destFields;
          destGroups[destination.groupIndex] = destGroup;
          
          // Update the source group and section
          sourceGroup.fields = sourceFields;
          sourceGroups[source.groupIndex] = sourceGroup;
          
          // Update the sections with both source and destination changes
          newSections[source.sectionIndex] = {
            ...sourceSection,
            groups: sourceGroups
          };
          
          newSections[destination.sectionIndex] = {
            ...destSection,
            groups: destGroups
          };
        }
        // If moving within the same group
        else if (destination.fieldIndex !== undefined) {
          // Calculate the target position
          let targetPosition = destination.fieldIndex;
          if (destination.position === 'after' && destination.fieldIndex > source.fieldIndex) {
            targetPosition--; // Adjust for the removed item
          }
          
          // Insert the moved field at the target position
          sourceFields.splice(targetPosition, 0, movedField);
          
          // Update the group, section, and sections
          sourceGroup.fields = sourceFields;
          sourceGroups[source.groupIndex] = sourceGroup;
          sourceSection.groups = sourceGroups;
          newSections[source.sectionIndex] = sourceSection;
        }
      }
      
      // Update the state with the new sections
      state.sections = newSections;
    },
  },
});

// Export individual action creators
export const {
  addSection,
  updateSection,
  removeSection,
  addGroup,
  updateGroup,
  removeGroup,
  addField,
  updateField,
  removeField,
  selectElement,
  clearSelection,
  moveElement,
} = formBuilderSlice.actions;

// Export the reducer as the default export
export default formBuilderSlice.reducer;

// Export the type for the root state
export type { FormBuilderState };
