
import { useEffect, useState } from 'react';
import { Flex, Button, message } from 'antd';
import styles from './index.less'
import IframePage from "../IframePage"
import OverPage from '../OverPage'
import { useConfigContext } from '@/Hooks/models/useConfigContext'


import { IDomNode } from '@/types'
import { useNodeTree } from '../../Hooks/useNodeTree'
import { matchBest, matchBestAgain, equal} from '@/utils/diff'

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
    let newDomTree = matchBest(nodeTree, domTree, weightConfig)
    console.log('-----模拟匹配dom树-----')
    console.table(newDomTree)
    
    const tempRightDoms: any[] = []
    const tempErrorDoms: any[] = []

    // diff
    nodeTree.forEach((node: any) => {

      const dom: any = newDomTree.find(item => item.id === node.id);
      
      if (!dom) {
        // console.log('当前node没有找到匹配到的dom', node)
      } else if (equal(node, dom)) {
        tempRightDoms.push(dom)        
      } else {
        tempErrorDoms.push(dom)
      }
    })
    // 未被匹配到的dom 叶子元素
    const tempBlanksDoms = newDomTree.filter((v) => {
      // 过滤掉非叶子结点
      if (v.childElementCount !== 0) {
        return false
      }
      if (v.height === 0 || v.width === 0) {
        return false
      }
      // 匹配到的
      if (v.figmaNode) {
        return false
      }
      return true
    })

    matchBestAgain(nodeTree, tempBlanksDoms, weightConfig)

    console.log('tempRightDoms', tempRightDoms)

    nodesDispatch({
      type: 'updateState',
      payload: {
        rightNodes: tempRightDoms,
        errorNodes: tempErrorDoms,
        showRightNodes: false,
        showErrorNodes: false
      }
    })

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
          <Preview></Preview>
        </div>
      </div>
      
    </div>
  )
}

export default Center
