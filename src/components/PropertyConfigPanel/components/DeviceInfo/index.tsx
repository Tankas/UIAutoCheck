import React, { useContext } from "react";

import type { InputNumberProps } from 'antd';
import { InputNumber } from 'antd';

import { useConfigContext } from '@/Hooks/models/useConfigContext'


const DeviceInfo: React.FC<any> = () => {

  const { deviceConfig } = useConfigContext();

  const onChange: InputNumberProps['onChange'] = (value) => {
    console.log('changed', value);
  };

  const width = deviceConfig.width;
  const height = deviceConfig.height;

  return (
    <>
      <div>
        <div>
            width: <InputNumber min={370} max={1000} value={width} onChange={onChange} />
        </div>
        <div>
            height: <InputNumber min={500} max={1000} value={height} onChange={onChange} />
        </div>
      </div>
    </>
  )
}

export default DeviceInfo;