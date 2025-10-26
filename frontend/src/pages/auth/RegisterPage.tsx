import { Button, Card, Form, Input, Typography } from 'antd';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

const { Title } = Typography;

export default function RegisterPage() {
  const { register, isAuthenticated, error, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/builder');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: { name: string; email: string; password: string; confirm: string }) => {
    if (values.password !== values.confirm) {
      // This should be shown to the user
      console.error('Passwords do not match');
      return;
    }
    
    try {
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password, // Don't trim password
        password_confirmation: values.confirm // Some APIs expect this field
      });
    } catch (err) {
      console.error('Registration failed:', err);
      // The error will be displayed from the auth state
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={2} style={styles.title}>
          Create an Account
        </Title>
        {error && <div style={styles.error}>{error}</div>}
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

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
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
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
              Register
            </Button>
          </Form.Item>
        </Form>
        <div style={styles.footer}>
          Already have an account? <Link to="/login">Login here</Link>
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
