import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './features/auth/useAuth';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import FormBuilderPage from './pages/FormBuilderPage';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <Routes>
          <Route path="/" element={
            isAuthenticated ? 
              <Navigate to="/builder" replace /> : 
              <Navigate to="/login" replace />
          } />
          <Route path="/login" element={
            isAuthenticated ? 
              <Navigate to="/builder" replace /> : 
              <LoginPage />
          } />
          <Route path="/register" element={
            isAuthenticated ? 
              <Navigate to="/builder" replace /> : 
              <RegisterPage />
          } />
          <Route 
            path="/builder" 
            element={
              <ProtectedRoute>
                <FormBuilderPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
