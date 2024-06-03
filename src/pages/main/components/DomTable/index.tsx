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


const isEqual = (a: number | string, b: number | string) => {
  const numberA = +window.parseFloat(a).toFixed(2);
  const numberB = +window.parseFloat(b).toFixed()
  return numberA === numberB
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
      if (!isEqual(domProp, figmaProp)) {
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
  const domFontSize = node?.cssStyle?.fontStyle?.fontSize
  const domFontWeight = node?.cssStyle?.fontStyle?.fontWeight
  const { width: figmaWidth, height: figmaHeight, top: figmaTop, left: figmaLeft } = node.figmaNode
  const figmaFontSize = node.figmaNode?.fontStyle?.fontSize
  const figmaFontWeight = node.figmaNode?.fontStyle?.fontWeight

  // 非文本节点 不显示显示 fontSize 
  const showFontInfo = !(node.figmaNode.type !== 'TEXT' && !node.figmaNode.fontStyle)

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
  if (showFontInfo) {
    data.push({
      key: '5',
      propName: 'fontSize',
      domProp: domFontSize,
      figmaProp: figmaFontSize,
    })
    data.push({
      key: '6',
      propName: 'fontWeight',
      domProp: domFontWeight,
      figmaProp: figmaFontWeight,
    })
  }

  return (
    <>
     <Table columns={columns} dataSource={data} bordered pagination={false} />
    </>
  )

}

export default DomTable;

