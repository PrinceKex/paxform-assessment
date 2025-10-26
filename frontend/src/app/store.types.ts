/**
 * Centralized type definitions for the Redux store
 * This file should be the single source of truth for all Redux-related types
 */

// Import slice state types
import type { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import type { AuthState } from '../features/auth/authSlice';
import type { FormBuilderState } from '../features/formBuilder/formBuilderTypes';

// Define the root state interface
export interface RootState {
  formBuilder: FormBuilderState;
  auth: AuthState;
  // Add other slice states here when needed
  // Example:
  // user: UserState;
}

// Define AppDispatch type for use with thunks
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
