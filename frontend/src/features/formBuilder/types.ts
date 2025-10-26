export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  disabled?: boolean;
  defaultValue?: string | number | boolean | string[] | number[] | boolean[];
  options?: Array<{ label: string; value: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    errorMessage?: string;
  };
}

export interface FormGroup {
  id: string;
  title: string;
  fields: FormField[];
  columns?: number;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  groups: FormGroup[];
}

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface FormBuilderState {
  sections: FormSection[];
  selectedElement: string | null;
  activeSectionId: string | null;
  activeGroupId: string | null;
  status: Status;
  error: string | null;
  activeFieldId: string | null;
}

export type FormElement = FormSection | FormGroup | FormField;

export interface DropPosition {
  sectionIndex?: number;
  groupIndex?: number;
  fieldIndex?: number;
  position: 'before' | 'after' | 'inside';
}
