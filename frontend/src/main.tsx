import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './app/store';
import { setCredentials } from './features/auth/authSlice';
import './index.css';

// Initialize auth state if token exists
const token = localStorage.getItem('token');
if (token) {
  // You might want to verify the token or fetch user data here
  // For now, we'll just set the token in the store
  store.dispatch(setCredentials({ token, user: null }));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
