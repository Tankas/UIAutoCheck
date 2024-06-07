import React, { useContext } from "react";
import type { FormProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { Button, Popover, Form, Input } from 'antd';
import { useConfigContext } from '@/Hooks/models/useConfigContext'

import tip1 from '@/assets/imgs/tip1.png'
import tip2 from '@/assets/imgs/tip2.png'

type FieldType = {
  pageLink?: string;
  figmaLink?: string;
  figmaRootName?: string;
  clientToolBarHeight?: number;
};

const ClientToolBarHeightLabel = () => {

  const content = (
    <div>
      <img style={{width: '600px'}} src={tip2} alt="" />
    </div>
  )

  return (

    <>
      <Popover
        content={content}
        title="Title"
        trigger="click"
      >
        <div className="">
          header 高度
          <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
        </div>
      </Popover>
    </>
  )
}

const FigmaRootNameLabel = () => {

  const content = (
    <div>
      <img style={{width: '600px'}} src={tip1} alt="" />
    </div>
  )

  return (

    <>
      <Popover
        content={content}
        title="Title"
        trigger="click"
      >
        <div className="">
          figma根节点名称
          <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
        </div>
      </Popover>
    </>
  )
}


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
    alert('success')
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
        label={<FigmaRootNameLabel></FigmaRootNameLabel>}
        name="figmaRootName"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label={<ClientToolBarHeightLabel></ClientToolBarHeightLabel>}
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