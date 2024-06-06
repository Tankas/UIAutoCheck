import React, { createContext, useContext, useEffect, useReducer } from "react";
import AppProvider from '@/components/AppProvider'
import { Outlet } from 'umi';

import PropertyConfigPanel from '@/components/PropertyConfigPanel'
import styles from './index.less'
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import Guide from '@/components/PropertyConfigPanel/components/Guide'
import BaseTable from "@/components/PropertyConfigPanel/components/baseTable";
import WeightTable from "@/components/PropertyConfigPanel/components/weightTable";

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '接入指南',
    children: <Guide></Guide>,
  },
  {
    key: '2',
    label: '基础配置',
    children: <BaseTable></BaseTable>,
  },
  {
    key: '3',
    label: '权重配置',
    children: <WeightTable></WeightTable>,
  },
];

const Config = () => {

  return (
    <>
      <Tabs tabBarGutter={100} tabBarStyle={{height:'100px'}} defaultActiveKey="1" items={items} centered />
    </>

  )
}

export default Config