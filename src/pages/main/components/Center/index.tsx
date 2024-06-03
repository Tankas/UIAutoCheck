
import { useEffect, useState } from 'react';
import { Flex, Button, message } from 'antd';
import styles from './index.less'
import IframePage from "../IframePage"
import OverPage from '../OverPage'
import { useConfigContext } from '@/Hooks/models/useConfigContext'


import { IDomNode } from '@/types'
import { useNodeTree } from '../../Hooks/useNodeTree'
import { diff } from '@/utils/diff'

import { useNodeContext } from '@/Hooks/models/useNodeContext'
import DomTable from '../DomTable'
import Preview from '../Preview';

const Center = () => {

  const { baseConfig, weightConfig } = useConfigContext()


  const { rightNodes, showRightNodes, showErrorNodes, errorNodes, dispatch: nodesDispatch, showNodeTable, nodeTableInfo } = useNodeContext() 

  const [ domTree, setDomTree ] = useState<IDomNode[]>([]);

  const { nodeTree } = useNodeTree(baseConfig)

  const canUse = domTree.length === 0;

  const diffCheck = async () => {
    // 1 v 1 匹配
    let { rightDoms, errorDoms } = diff(nodeTree, domTree, weightConfig)

    nodesDispatch({
      type: 'updateState',
      payload: {
        rightNodes: rightDoms,
        errorNodes: errorDoms,
        showRightNodes: false,
        showErrorNodes: false
      }
    })

    alert('对比完成')

  }

  const showRightDoms = () => {
    nodesDispatch({
      type: 'updateState',
      payload: {
        showRightNodes: !showRightNodes,
      }
    })
  }

  const showErrorDoms = () => {
    nodesDispatch({
      type: 'updateState',
      payload: {
        showErrorNodes: !showErrorNodes,
      }
    })
  }

  /**
   * 业务页面加载完成
   * @param {domNodes} 
   */
  const domLoad = ({domNodes}: {
    domNodes: IDomNode[]
  }) => {
    setDomTree(domNodes)
  }


  return (
    <div>
      <div className="operate">
        <Button disabled={domTree.length === 0} type="primary" onClick={diffCheck}>对比</Button>
        <Button disabled={domTree.length === 0} type="primary" onClick={showRightDoms}>显示正确dom</Button>
        <Button disabled={domTree.length === 0} type="primary" onClick={showErrorDoms}>显示错误dom</Button>
      </div>
      <div className={styles.views}>
        <div className={styles.pageContainer}>
          <IframePage domLoad={domLoad} url={baseConfig.pageLink} ></IframePage>
          {
            showRightNodes ? <OverPage domNodes={rightNodes}></OverPage> : null
          }
          {
            showErrorNodes ? <OverPage domNodes={errorNodes}></OverPage> : null
          }
        </div>
        <div className={styles.nodeTable}>
          {
            showNodeTable ? <DomTable node={nodeTableInfo}></DomTable> : null
          }
        </div>
        <div className="preview">
          {/* <Preview></Preview> */}
        </div>
      </div>
      
    </div>
  )
}

export default Center
