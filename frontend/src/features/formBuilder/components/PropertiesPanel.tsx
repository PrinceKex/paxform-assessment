import { Button, Divider, Form, Input, InputNumber, Switch, Typography } from 'antd';
import { useEffect } from 'react';
import type { FormField } from '../types';

const { Title } = Typography;
const { TextArea } = Input;

interface PropertiesPanelProps {
  selectedField: FormField | null;
  onUpdateField: (field: FormField) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedField, onUpdateField }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedField) {
      form.setFieldsValue(selectedField);
    } else {
      form.resetFields();
    }
  }, [selectedField, form]);

  const onValuesChange = (_: unknown, values: Partial<FormField>) => {
    if (!selectedField) return;
    onUpdateField({ ...selectedField, ...values });
  };

  if (!selectedField) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
        <Title level={4} style={{ marginBottom: '8px' }}>Field Properties</Title>
        <p>Select a field to edit its properties</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <Title level={4} style={{ marginBottom: '16px' }}>Field Properties</Title>
      
      <Form
        form={form}
        layout="vertical"
        onValuesChange={onValuesChange}
        initialValues={selectedField}
      >
        <Form.Item 
          label="Label" 
          name="label"
          rules={[{ required: true, message: 'Please enter a label' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Placeholder" name="placeholder">
          <Input />
        </Form.Item>

        <Form.Item label="Required" name="required" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Disabled" name="disabled" valuePropName="checked">
          <Switch />
        </Form.Item>

        {(selectedField.type === 'number' || selectedField.type === 'text') && (
          <>
            <Divider orientation="left" style={{ margin: '16px 0' }}>Validation</Divider>
            
            {selectedField.type === 'number' && (
              <>
                <Form.Item label="Minimum Value" name={['validation', 'min']}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Maximum Value" name={['validation', 'max']}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </>
            )}

            <Form.Item label="Minimum Length" name={['validation', 'minLength']}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item label="Maximum Length" name={['validation', 'maxLength']}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Validation Pattern" name={['validation', 'pattern']}>
              <Input placeholder="e.g., ^[A-Za-z]+$" />
            </Form.Item>
            
            <Form.Item 
              label="Error Message" 
              name={['validation', 'errorMessage']}
              tooltip="Message to show when validation fails"
            >
              <Input />
            </Form.Item>
          </>
        )}

        {selectedField.type === 'select' && (
          <>
            <Divider orientation="left" style={{ margin: '16px 0' }}>Options</Divider>
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'label']}
                        style={{ flex: 1, marginRight: 8, marginBottom: 0 }}
                        rules={[{ required: true, message: 'Label is required' }]}
                      >
                        <Input placeholder="Label" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        style={{ flex: 1, marginRight: 8, marginBottom: 0 }}
                        rules={[{ required: true, message: 'Value is required' }]}
                      >
                        <Input placeholder="Value" />
                      </Form.Item>
                      <Button
                        type="text"
                        danger
                        onClick={() => remove(name)}
                        style={{ marginBottom: 24 }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Form.Item>
                    <Button 
                      type="dashed" 
                      onClick={() => add({ label: '', value: '' })} 
                      block
                    >
                      Add Option
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        )}
      </Form>
    </div>
  );
};

export default PropertiesPanel;
