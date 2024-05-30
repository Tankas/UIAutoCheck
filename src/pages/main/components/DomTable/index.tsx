import React from "react";

import { Table, Space, Tag } from 'antd';
import type { TableProps } from 'antd';

export type IDomItemTable = {
  node: any;
}

interface DataType {
  key: string;
  propName: string;
  domProp: string;
  figmaProp: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '',
    dataIndex: 'propName',
    key: 'propName',
    render: (text) => <span>{text}</span>,
  },
  {
    title: 'dom',
    dataIndex: 'domProp',
    key: 'domProp',
    render: (_, { domProp, figmaProp }) => {
      const style: any = {}
      if (domProp !== figmaProp) {
        style.color = 'red'
      }
      return (
        <span style={style}>{domProp}</span>
      )
    },
  },
  {
    title: '设计稿',
    dataIndex: 'figmaProp',
    key: 'figmaProp',
  }
];

const DomTable: React.FC<IDomItemTable> = ({
  node
}) => {
  console.log('DomItemTable', node)
  const { width: domWidth, height: domHeight, top: domTop, left: domLeft } = node;
  const { width: figmaWidth, height: figmaHeight, top: figmaTop, left: figmaLeft } = node.figmaNode
  const data: DataType[] = [
    {
      key: '1',
      propName: 'width',
      domProp: domWidth,
      figmaProp: figmaWidth,
    },
    {
      key: '2',
      propName: 'height',
      domProp: domHeight,
      figmaProp: figmaHeight,
    },
    {
      key: '3',
      propName: 'top',
      domProp: domTop,
      figmaProp: figmaTop,
    },
    {
      key: '4',
      propName: 'left',
      domProp: domLeft,
      figmaProp: figmaLeft,
    },
  ];
  return (
    <>
     <Table columns={columns} dataSource={data} bordered pagination={false} />
    </>
  )

}

export default DomTable;

