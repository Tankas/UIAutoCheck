import React, { useState } from "react";

import type { InputNumberProps } from 'antd';
import { InputNumber, Button } from 'antd';

import { useConfigContext } from '@/Hooks/models/useConfigContext'
import styles from './index.less'

const DeviceConfig: React.FC<any> = () => {

  const { deviceConfig, dispatch } = useConfigContext();

  console.log('deviceConfig', deviceConfig)

  const [width, setWidth] = useState(deviceConfig.width)
  const [height, setHeight] = useState(deviceConfig.height)

  const onChangeWidth: InputNumberProps['onChange'] = (value) => {
    setWidth(Number(value))
  };

  const onChangeHeight: InputNumberProps['onChange'] = (value) => {
    setHeight(Number(value))
  };

  const update = () => {
    dispatch({
      type: 'updateState',
      payload: {
        deviceConfig: {
          ...deviceConfig,
          width,
          height
        }
      }
    })
    alert('success')
  }


  return (
    <div className={styles.container}>
      <div>
          <InputNumber min={0} required value={width} onChange={onChangeWidth} />
      </div>
      <span className={styles.x}>X</span>
      <div>
          <InputNumber min={0} value={height} onChange={onChangeHeight} />
      </div>
      <div>
        <Button style={{marginLeft: '10px'}} onClick={update} type="primary" >update</Button>
      </div>
    </div>
  )
}

export default DeviceConfig;