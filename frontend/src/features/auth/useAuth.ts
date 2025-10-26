import { useAppDispatch, useAppSelector } from '../../app/store';
import type { RootState } from '../../app/store.types';
import { login, logout, register } from './authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, status, error } = useAppSelector((state: RootState) => state.auth);

  return {
    // State
    user,
    token,
    isAuthenticated: !!token,
    isLoading: status === 'loading',
    error,
    
    // Actions
    login: (credentials: { email: string; password: string }) => dispatch(login(credentials)),
    register: (userData: { name: string; email: string; password: string; password_confirmation: string }) => 
      dispatch(register(userData)),
    logout: () => dispatch(logout()),
  };
};

export default useAuth;
