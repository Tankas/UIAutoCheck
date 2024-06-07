
import { useEffect, useState } from 'react';
import { Flex, Button, message, Switch, Modal } from 'antd';
import styles from './index.less'
import IframePage from "../IframePage"
import OverPage from '../OverPage'

import { IDomNode } from '@/types'
import { useNodeTree } from '../../Hooks/useNodeTree'
import { diff } from '@/utils/diff'

import DeviceConfig from '@/components/PropertyConfigPanel/components/DeviceConfig';
import DomTable from '../DomTable'
import Preview from '../Preview';
import cloneDeep from 'lodash/cloneDeep';
import { useNodeContext } from '@/Hooks/models/useNodeContext'
import { useUserContext } from '@/Hooks/models/useUserContext';
import { useConfigContext } from '@/Hooks/models/useConfigContext'

const Center = () => {

  const [messageApi, contextHolder] = message.useMessage();

  const { baseConfig, weightConfig, scoreConfig, deviceConfig } = useConfigContext()

  const { dispatch: userDispatch, showDesignPic, showScoreConfigWrapper, showDiffDimension  } = useUserContext()

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
  
  

  const handleShowDiffDimension = (checked: boolean) => {
    userDispatch({
      type: 'updateState',
      payload: {
        showDiffDimension: checked
      }
    })
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
      // alert('配置链接')
      messageApi.info('未配置必要链接,去配置')
    }
  }, [])

  const deviceStyle = {
    height: deviceConfig.height + 'px',
    width: deviceConfig.width + 'px',
  }

  return (
    <div>
      {contextHolder}
      <div className={styles.operate}>
        <Button style={{marginRight: '10px'}} disabled={domTree.length === 0} onClick={diffCheck}>对比</Button>
        <Button style={{marginRight: '10px'}} disabled={domTree.length === 0} onClick={showRightDoms}>显示正确UI</Button>
        <Button style={{marginRight: '10px'}} disabled={domTree.length === 0} onClick={showErrorDoms}>显示错误UI</Button>
        <Switch style={{marginRight: '10px'}} checkedChildren="得分维度" unCheckedChildren="得分维度" checked={showDiffDimension}  onChange={handleShowDiffDimension}  />
        <Switch style={{marginRight: '10px'}} checkedChildren="分数配置" unCheckedChildren="分数配置" checked={showScoreConfigWrapper}  onChange={handleShowScoreConfigWrapper}  />
        <Switch style={{marginRight: '10px'}} checkedChildren="设计图" unCheckedChildren="设计图" checked={showDesignPic} onChange={handleShowDesignPic} disabled={!baseConfig.figmaLink} />
      </div>
      <div style={{width: deviceStyle.width}}>
        <DeviceConfig></DeviceConfig>
      </div>
      <div className={styles.views}>

        <div className={styles.pageContainer} style={{
          height: deviceConfig.height + 'px',
          width: deviceConfig.width + 'px',
        }}>
          <div className={styles.clientHeader}></div>
          <div className={styles.overPage} style={{
            height: deviceConfig.height + 'px',
            width: deviceConfig.width + 'px',
            }} >
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

        </div>
        {/* 结果对比table */}
        <div className={styles.nodeTable}>
          {
            showNodeTable ? <DomTable node={nodeTableInfo}></DomTable> : null
          }
        </div>
        {/* 设计稿 */}
        <div className={styles.preview}>
          <Preview></Preview>
        </div>
        
      </div>
    
    </div>
  )
}

export default Center
