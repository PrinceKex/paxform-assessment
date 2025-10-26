import { Layout } from 'antd';
import FormBuilder from '../features/formBuilder/components/FormBuilder';

const { Content } = Layout;

export default function FormBuilderPage() {
  return (
    <Layout className="form-builder-page" style={{ minHeight: '100vh' }}>
      <Layout>
        <Content style={{ padding: '24px' }}>
          <FormBuilder />
        </Content>
      </Layout>
    </Layout>
  );
}
