import React, { useContext } from "react";
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { useConfigContext } from '@/Hooks/models/useConfigContext'


type FieldType = {
  pageLink?: string;
  figmaLink?: string;
  figmaRootName?: string;
  clientToolBarHeight?: number;
};

const BaseTable: React.FC = () => {
  const [form] = Form.useForm();
  const { baseConfig, dispatch } = useConfigContext();


  const checkFields = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        await form.validateFields()
        resolve(true)
      } catch (err) {
        reject(false)
      }
    })
    
  }

  const handleUpdate  = async () => {
    await checkFields()
    
    const { pageLink, figmaLink, figmaRootName, clientToolBarHeight } = form.getFieldsValue()
    dispatch({
      type: 'updateState',
      payload: {
        baseConfig: {
          ...baseConfig,
          pageLink,
          figmaLink,
          figmaRootName,
          clientToolBarHeight: +clientToolBarHeight || baseConfig?.clientToolBarHeight || 88
        }
      }
    })
  }

  
  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={baseConfig}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="页面链接"
        name="pageLink"
        rules={[{ required: true, type: 'url', message: '' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Figma链接"
        name="figmaLink"
        rules={[{ required: true,type: 'url', message: '' }]}
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

      <Form.Item<FieldType>
        label="header 高度"
        name="clientToolBarHeight"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={handleUpdate}>更新</Button>
      </Form.Item>
  </Form>
  )
}

export default BaseTable;