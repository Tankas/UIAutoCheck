import { useState, useEffect } from 'react'
import { getNodeList } from '@/utils/index'

export const useNodeTree = (baseConfig: any): {
  nodeTree: any[]
} => {
  const [ nodeTree, setNodeTree ] = useState<any[]>([]);
  const { figmaLink, figmaRootName, clientToolBarHeight } = baseConfig
  
  const getNodeTree = async () => {
    if (!baseConfig.figmaLink) {
      return
    }
    let nodeList = await getNodeList({
      url: baseConfig.figmaLink,
      figmaRootName: baseConfig.figmaRootName,
      clientToolBarHeight: baseConfig.clientToolBarHeight
    })
    nodeList = nodeList.filter((item: { type: string }) => {
      return item.type !== 'CANVAS' && item.type !== 'DOCUMENT'
    })
    setNodeTree(nodeList)
  }
  
  useEffect(() => {
    getNodeTree()
  }, [figmaLink, figmaRootName, clientToolBarHeight ])



  return {
    nodeTree
  }

}