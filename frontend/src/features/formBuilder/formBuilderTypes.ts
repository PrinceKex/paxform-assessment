import type { FormData } from '../../api/formService';
import type { FormSection } from './types';

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface FormBuilderState {
  forms: FormData[];
  currentForm: FormData | null;
  sections: FormSection[];
  status: Status;
  error: string | null;
  selectedElement: string | null;
  activeSectionId: string | null;
  activeGroupId: string | null;
  activeFieldId: string | null;
}

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
