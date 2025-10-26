import type { AuthState } from '../features/auth/authSlice';
import type { FormBuilderState } from '../features/formBuilder/types';

export interface AppState {
  auth: AuthState;
  formBuilder: FormBuilderState;
}
