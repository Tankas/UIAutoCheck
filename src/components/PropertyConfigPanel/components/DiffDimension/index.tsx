import { useConfigContext } from "@/Hooks/models/useConfigContext"
import styles from './index.less'

import { Button, Switch, Form, Input } from 'antd';

const DiffDimension = () => {
  const [form] = Form.useForm();
  const { weightConfig, dispatch } = useConfigContext()

  const onFieldsChange = (field: { name: any; value: any; }[]) => {
    const { name, value } = field[0]
    let newWeightConfig: any = { ...weightConfig }
    newWeightConfig[name[0]][name[1]] = value
    dispatch({
      type: 'updateState',
      weightConfig: newWeightConfig
    })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>得分维度</div>
      <div className={styles.main}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          initialValues={weightConfig}
          onFieldsChange={onFieldsChange}
        >
          <Form.Item label="height" name={['height', 'open']}>
            <Switch />
          </Form.Item>
          <Form.Item label="width" name={['width', 'open']}>
            <Switch/>
          </Form.Item>
          <Form.Item label="top" name={['top', 'open']}>
            <Switch/>
          </Form.Item>
          <Form.Item label="left" name={['left', 'open']}>
            <Switch/>
          </Form.Item>
          <Form.Item label="borderRadius" name={['borderRadius', 'open']}>
            <Switch/>
          </Form.Item>
          <Form.Item label="fontSize" name={['fontSize', 'open']}>
            <Switch/>
          </Form.Item>
          <Form.Item label="fontWeight" name={['fontWeight', 'open']}>
            <Switch/>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default DiffDimension