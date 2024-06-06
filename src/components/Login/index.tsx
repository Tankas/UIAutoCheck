import React, { useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { post } from '@/utils/request'
import styles from './index.less'
import { useUserinfo } from '@/Hooks/useUserinfo';
import { useUserContext } from '@/Hooks/models/useUserContext';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};


const Login: React.FC = (props: any) => {

  const { showLoginWrapper, dispatch } = useUserContext();

  const [modelShow, setModelShow] = useState(true);
  const [loading, setLoading] = useState(false);

  
  const [,,getUserInfo] = useUserinfo();
  const login = async ({
    username,
    password
  }: {
    username: string,
    password: string
  }) => {
    return post('/api/login', {
      name: username,
      password: password
    })
  }

  const onFinish = async (values: any) => {
    // const { username, password } = values;
    setLoading(true);
    try {
      await login(values);
      await getUserInfo();
      closeDialog();
    } catch (err) {
      console.log(err)
      alert(err?.msg)
    }
    setLoading(false)
    console.log('finish')
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  if (!showLoginWrapper) {
    return null
  }

  const createContent = () => {
    return (
      <div className={styles.formContainer}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  const closeDialog = () => {
    dispatch({
      type: 'updateState',
      payload: {
        showLoginWrapper: false
      }
    })
  }

  return (
    <Modal open={modelShow} footer={null} onCancel={()=>{}} confirmLoading={true}>
      {
        createContent()
      }
    </Modal>
  )
}


export default Login