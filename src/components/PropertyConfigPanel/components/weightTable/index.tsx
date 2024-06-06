import React from "react";
import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography } from 'antd';
import LineChart from "./lineChart";

import { useConfigContext } from '@/Hooks/models/useConfigContext'

export type IProps = {

}
const WeightTable: React.FC<IProps> = () => {

  const { weightConfig } = useConfigContext()
  const items =  Object.values(weightConfig)
  const [form] = Form.useForm();
  return (
    <Form
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 18 }}
      form={form}
      name="dynamic_form_complex"
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={{ items }}
    >
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', rowGap: 3, flexDirection: 'column' }}>
            {fields.map((field) => (
              <Card
                size="small"
                title={items[field.name].label}
                key={field.key}
              >
                <Form.Item label="权重" name={[field.name, 'weight']}>
                  <Input />
                </Form.Item>

                <Form.Item label="分数" name={[field.name, 'score']}>
                  <Input />
                </Form.Item>
                <LineChart points={{}}></LineChart>
              </Card>
            ))}
          </div>
        )}
      </Form.List>
    </Form>
  );
}

export default WeightTable


