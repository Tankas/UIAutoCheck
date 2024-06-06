
import { useEffect, useState } from 'react';
import { Flex, Button, message, Switch } from 'antd';
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
import cloneDeep from 'lodash/cloneDeep';

import { useUserContext } from '@/Hooks/models/useUserContext';

const Center = () => {

  const { baseConfig, weightConfig, scoreConfig } = useConfigContext()

  const { dispatch: userDispatch, showDesignPic, showScoreConfigWrapper  } = useUserContext()

  const { rightNodes, showRightNodes, showErrorNodes, errorNodes, dispatch: nodesDispatch, showNodeTable, nodeTableInfo } = useNodeContext() 

  const [ domTree, setDomTree ] = useState<IDomNode[]>([]);

  const { nodeTree } = useNodeTree(baseConfig)

  const canUse = domTree.length === 0;

  const diffCheck = async () => {
    
    // 1 v 1 匹配
    let { rightDoms, errorDoms } = diff(cloneDeep(nodeTree), cloneDeep(domTree), weightConfig, scoreConfig)

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

  

  const handleShowScoreConfigWrapper = (checked: boolean) => {
    userDispatch({
      type: 'updateState',
      payload: {
        showScoreConfigWrapper: checked
      }
    })
  }

  const handleShowDesignPic = (checked: boolean) => {
    userDispatch({
      type: 'updateState',
      payload: {
        showDesignPic: checked
      }
    })
  }

  useEffect(() => {
    if (!baseConfig.figmaLink) {
      alert('配置链接')
    }
  }, [])

  return (
    <div>
      <div className={styles.operate}>
        <Button style={{marginRight: '10px'}} disabled={domTree.length === 0} onClick={diffCheck}>对比</Button>
        <Button style={{marginRight: '10px'}} disabled={domTree.length === 0} onClick={showRightDoms}>显示正确UI</Button>
        <Button style={{marginRight: '10px'}} disabled={domTree.length === 0} onClick={showErrorDoms}>显示错误UI</Button>
        <Switch style={{marginRight: '10px'}} checkedChildren="分数配置" unCheckedChildren="分数配置" checked={showScoreConfigWrapper}  onChange={handleShowScoreConfigWrapper}  />
        <Switch style={{marginRight: '10px'}} checkedChildren="设计图" unCheckedChildren="设计图" checked={showDesignPic} onChange={handleShowDesignPic} />
      </div>
      <div className={styles.views}>
        <div className={styles.pageContainer}>
          {
            baseConfig.pageLink ? 
              <IframePage domLoad={domLoad} url={baseConfig.pageLink} ></IframePage>
            : null
          }
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
        {
          showDesignPic ? <div className="preview">
            <Preview></Preview>
           </div> : null
        }
        
      </div>
      
    </div>
  )
}

export default Center
