import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

import WeightTable from './components/weightTable';
import BaseTable from './components/baseTable';
import Guide from './components/Guide';
import DeviceInfo from './components/DeviceInfo';
import { useConfigContext } from '@/Hooks/models/useConfigContext'


export default function PropertyConfigPanel() {
  const { weightConfig, baseConfig } = useConfigContext()
  const weightItems =  Object.values(weightConfig)

  const onChange = (key: string | string[]) => {
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: '接入指南',
      children: <Guide></Guide>,
    },
    {
      key: '2',
      label: '基础配置',
      children: <BaseTable values={baseConfig}></BaseTable>,
    },
    {
      key: '3',
      label: '权重配置',
      children: <WeightTable items={weightItems}></WeightTable>,
    },
    {
      key: '4',
      label: '设备信息',
      children: <DeviceInfo></DeviceInfo>,
    }
  ];
  return (
    <>
      <Collapse items={items} defaultActiveKey={['0']} onChange={onChange} />
    </>
  );
}