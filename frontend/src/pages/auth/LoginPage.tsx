import { Button, Card, Form, Input, Typography } from 'antd';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

const { Title } = Typography;

export default function LoginPage() {
  const { login, isAuthenticated, error, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login({
        email: values.email.trim(),
        password: values.password
      });
    } catch (err) {
      console.error('Login failed:', err);
      // The error will be displayed from the auth state
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={2} style={styles.title}>
          Login
        </Title>
        {error && <div style={styles.error}>{error}</div>}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={styles.submitButton}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div style={styles.footer}>
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  } as const,
  card: {
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  } as const,
  title: {
    textAlign: 'center',
    marginBottom: '24px',
  } as const,
  error: {
    color: '#ff4d4f',
    marginBottom: '16px',
    textAlign: 'center',
  } as const,
  submitButton: {
    marginBottom: '8px',
  } as const,
  footer: {
    marginTop: '16px',
    textAlign: 'center',
    color: '#666',
  } as const,
};
