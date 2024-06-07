
// @ts-nocheck

import axios from "axios";

export const personalAccessToken = 'figd_dUNCJtlT6w5LC8o-3y1yTAvJiY5cHdx_E8OJNgiS'

function extractUrlParts(urlStr) {
  const url = new URL(urlStr);
  // 获取路径部分
  const pathSegments = url.pathname.split('/');
  // 跳过空字符串和域名部分
  let levelOne = '', levelTwo = '';
  for (let i = 1; i < pathSegments.length; i++) {
    if (levelOne === '') {
      levelOne = pathSegments[i];
    } else if (levelTwo === '') {
      levelTwo = pathSegments[i];
      break;
    }
  }
  return { levelOne, levelTwo };
}

export function parseFigmaURL(url) {  
  // 使用URL类来解析传入的url参数  
  const parsedUrl = new URL(url);  
  
  // 获取pathname部分，并分割成数组  
  const pathSegments = parsedUrl.pathname.split('/');  
  
  const { levelOne: type } = extractUrlParts(url);
  
  // 查找fileid，它应该在'file'段后面  
  const fileIndex = pathSegments.indexOf(type);  
  let fileId = fileIndex >= 0 && fileIndex < pathSegments.length - 1 ? pathSegments[fileIndex + 1] : null;  
  
  // 获取查询参数中的node-id  
  const nodeId = parsedUrl.searchParams.get('node-id');  
  
  // 返回结果对象  
  return {  
    fileId,  
    nodeId  
  };  
} 

const flattenNodes = (node: any, flattenedArray = [], parentAbsolutePosition = { x: 0, y: 0 }, parentId = null) => {
  // 计算当前节点的绝对位置
  // const absolutePosition = {
  //   x: parentAbsolutePosition.x + (node.absoluteBoundingBox ? node.absoluteBoundingBox.x : 0),
  //   y: parentAbsolutePosition.y + (node.absoluteBoundingBox ? node.absoluteBoundingBox.y : 0)
  // };
  const absolutePosition = {
    x: (node.absoluteBoundingBox ? node.absoluteBoundingBox.x : 0),
    y: (node.absoluteBoundingBox ? node.absoluteBoundingBox.y : 0)
  };

  // 创建当前节点的信息并加入到数组中
  const nodeInfo = {
    id: node.id,
    parentId: parentId,
    width: node.absoluteBoundingBox ? node.absoluteBoundingBox.width : undefined,
    height: node.absoluteBoundingBox ? node.absoluteBoundingBox.height : undefined,
    left: absolutePosition.x,
    top: absolutePosition.y,
    name: node.name,
    type: node.type,
    cornerRadius: node.cornerRadius || 0,
    fontStyle: node.style,
    node
  };
  flattenedArray.push(nodeInfo);

  // 如果存在子节点，递归遍历它们
  if (node.children) {
    node.children.forEach(child => {
      flattenNodes(child, flattenedArray, absolutePosition, node.id);
    });
  }
  return flattenedArray;
}


const getRootPageNode = (node, name) => {
  if (node.name === name) {
    return node
  }
  const childrenList = node.children || []
  for (let i = 0; i < childrenList.length; i++) {
    const childNode = getRootPageNode(node.children[i], name)
    if (childNode) {
      return childNode
    }
  }
  return null
}

export const getNodeList = async ({
  url,
  figmaRootName,
  clientToolBarHeight = 88
}) => {
  const { fileId, nodeId } = parseFigmaURL(url);
  
  let data = null;
  const cacheData = window.localStorage.getItem('file-node-tree')
  if (cacheData) {
    data = JSON.parse(cacheData)
  } else {
    data = await getFigmaFileNodeTree({
      fileID: fileId,
      nodeIds: nodeId
    });
    window.localStorage.setItem('file-node-tree', JSON.stringify(data))
  }

  const rootPageNode = getRootPageNode(data.data.document, figmaRootName)
  const nodeList =  flattenNodes(rootPageNode)
  // 跟节点 left top , 计算每一个node的相对left top
  const rootAbsolutePosition = {
    x: (rootPageNode.absoluteBoundingBox ? rootPageNode.absoluteBoundingBox.x : 0),
    y: (rootPageNode.absoluteBoundingBox ? rootPageNode.absoluteBoundingBox.y : 0)
  };
  nodeList.forEach((item) => {
    item.left = item.left - rootAbsolutePosition.x
    item.top = item.top - rootAbsolutePosition.y - clientToolBarHeight
  })
  return nodeList
}

export const getFigmaFileNodeTree = async ({
  fileID,
  nodeIds,
}) => {
  const apiEndpoint = `https://api.figma.com/v1/files/${fileID}?ids=${nodeIds}`;
  return axios({  
    method: 'get',  
    url: apiEndpoint,  
    headers: {  
      'X-Figma-Token': personalAccessToken  
    },  
    params: {  
      fileID,
    }  
  })
}

export const getImage = async ({
  fileId,
  nodeIds
}: any) => {
  const format = 'jpg'; // 或者 'png', 'svg', 'pdf' 等
  const scale = '1'; // 图片缩放比例
  return axios({  
    method: 'get',  
    url: `https://api.figma.com/v1/images/${fileId}`,  
    headers: {  
      'X-Figma-Token': personalAccessToken  
    },  
    params: {  
      ids: nodeIds,
      format: format,  
      scale: scale  
    }  
  })
}