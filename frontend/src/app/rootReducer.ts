import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import formBuilderReducer from '../features/formBuilder/formBuilderSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  formBuilder: formBuilderReducer,
});

export default rootReducer;

// Export RootState type for use throughout the app
export type RootState = ReturnType<typeof rootReducer>;
