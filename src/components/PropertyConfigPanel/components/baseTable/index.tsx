import React, { useContext } from "react";
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { useConfigContext } from '@/Hooks/models/useConfigContext'


type FieldType = {
  pageLink?: string;
  figmaLink?: string;
  figmaRootName?: string;
};

export type Iprops = {
  values: {
    pageLink: string;
    figmaLink: string;
    figmaRootName: string;
  }
} | null

const BaseTable: React.FC<Iprops> = () => {

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFieldsChange = (changedFields: any, allFields: any) => {
    console.log('allFields', allFields)
    console.log('changedFields', changedFields)
  }

  const { baseConfig } = useConfigContext();


  console.log('baseTable子组件更新', baseConfig)

  const handleUpdate  = () => {

  }

  
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={baseConfig}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onFieldsChange={onFieldsChange}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="页面链接"
        name="pageLink"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Figma链接"
        name="figmaLink"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="跟节点名称"
        name="figmaRootName"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
      <Button type="primary" onClick={handleUpdate}>update</Button>
      </Form.Item>
  </Form>
  )
}

export default BaseTable;