
// @ts-nocheck

export function parseFigmaURL(url) {  
  // 使用URL类来解析传入的url参数  
  const parsedUrl = new URL(url);  
  
  // 获取pathname部分，并分割成数组  
  const pathSegments = parsedUrl.pathname.split('/');  
  
  // 查找fileid，它应该在'file'段后面  
  const fileIndex = pathSegments.indexOf('file');  
  let fileId = fileIndex >= 0 && fileIndex < pathSegments.length - 1 ? pathSegments[fileIndex + 1] : null;  
  
  // 获取查询参数中的node-id  
  const nodeId = parsedUrl.searchParams.get('node-id');  
  
  // 返回结果对象  
  return {  
    fileId,  
    nodeId  
  };  
} 

const getScoreByX = (points, value) => {
  for (let i = 0; i < points.length - 1; i++) {  
    // 找到 value 所在的 x 坐标段  
    if (value >= points[i].x && value <= points[i + 1].x) {  
      // 进行线性插值  
      const x1 = points[i].x;  
      const y1 = points[i].y;  
      const x2 = points[i + 1].x;  
      const y2 = points[i + 1].y;  
        
      const y = y1 + ((y2 - y1) / (x2 - x1)) * (value - x1);  
      return y;  
    }  
  }  
  return 0; 
}

// 计算两个数值之间的相对差异，返回 0 到 1 之间的得分（1 表示完全相同，0 表示完全不同）y = ax + b
function calculateDifferenceScore(value1, value2, maxDifference) {
  const points = [
    {
      x: 0,
      y: 100,
    },
    {
      x: 10,
      y: 80,
    },
    {
      x: 50,
      y: 20,
    },
    {
      x: 100,
      y: 0,
    },
  ]
  const difference = Math.abs(value1 - value2);
  const score = getScoreByX(points, difference) / 100
  return score
  //
  // if (difference <= maxDifference) {
  //   // 如果差异小于等于允许的最大差异，则计算得分
  //   return 1 - (difference / maxDifference);
  // } else {
  //   // 如果差异超过最大差异，则得分为 0
  //   return 0;
  // }
}

const calculateBorderRadiusScore = (dom, figNode, config) => {
  const { borderRadius } = dom.cssStyle
  const borderRadiusValue = +window.parseFloat(borderRadius).toFixed(2)
  const figBorderRadiusValue = +window.parseFloat(figNode.cornerRadius).toFixed(2)
  if (borderRadiusValue == figBorderRadiusValue) {
    return 1
  }
  // 没有设置 radius
  if (figBorderRadiusValue == 0) {
    return 0
  }

  const score = 1 - Math.abs(figBorderRadiusValue - borderRadiusValue) / 100
  if (score < 0) {
    return 0
  }
  return score
}


/**
 * 总分 36
 * @param figmaNode 
 * @param domNode 
 * @param maxDiff 
 * @returns 
 */
export function calculateScore(figmaNode, domNode, config) {
  let score = 0;
  const info = {}
  // dom节点，里面都是文本，宽高特殊处理
  const isTextElement = domNode.textElementType;

  // domNode 里面只有文本，domNode 默认width height 都是正确的
  // 比较宽度和高度，权重为 10
  const widthScore = calculateDifferenceScore(figmaNode.width, domNode.width, config.width.points) * config.width.score;
  info.widthScore = widthScore;
  // 文本节点，默认宽度是正确的
  if (isTextElement) {
    info.widthScore = config.width.score;
  }

  score += info.widthScore;
  const heightScore = calculateDifferenceScore(figmaNode.height, domNode.height, config.height.points) * config.height.score;
  info.heightScore = heightScore;
  // 文本节点，暂时允许height 误差值，暂定4px
  // if (isTextElement) {
  //   info.heightScore = config.height.score;
  // }
  // 
  score += info.heightScore;
  // 比较 top 和 left 位置，权重为 8
  const topScore = calculateDifferenceScore(figmaNode.top, domNode.top, config.top.points) * config.top.score;
  info.topScore = topScore;
  score += topScore;
  const leftScore = calculateDifferenceScore(figmaNode.left, domNode.left, config.left.points) * config.left.score;
  info.leftScore = leftScore;
  score += leftScore;
  
  // 计算 css border radius


  const borderRadiusScore = calculateBorderRadiusScore(domNode, figmaNode)
  info.borderRadiusScore = borderRadiusScore;
  score += borderRadiusScore
  info.totalScore = score;
  return {
    score, info
  };
}

/**
 * 评分标准
 * 1. 总得分不能低于 10
 * 2. width, height 得分不能低于 各自项最高得分的1%, 
 *  文本节点，宽度默认正确，无法和UI对其
 * 3. top left 得分不能低于 各自项最高得分的10%
 */
const isMatchScoreStandard = (info) => {
  const { totalScore, widthScore, heightScore, topScore, leftScore } = info;
  if (totalScore >= 30) {
    return true;
  } else {
    return false;
  }
  // if (totalScore >= 10 && widthScore >= 1 && heightScore >= 1 && topScore >= 1 && leftScore >= 1) {
  //   return true;
  // } else {
  //   return false;
  // }
}

/**
 * 当前figmaNode 匹配的最高得分的dom
 * @param figmaNode 
 * @param DomTypeArr 
 * @returns 
 */
const getHighestScoreDom = (figmaNode, DomTypeArr) => {
  let score = 0;
  let bestMatch = null;
  DomTypeArr.forEach((dom) => {
    const fNode = dom.figmaNodeMap[figmaNode.id]
    if (fNode.score > score) {
      score = fNode.score;
      bestMatch = dom
    }
  })
  return bestMatch
}

export type FigmaMapNode = {
  score: number,
  info: any,
  figmaNode: any
}

/**
 * 每一个dom figmaNodeMap 存储所有figmaNode的得分
 * @param NodeTypeArr 
 * @param DomTypeArr 
 * @param config 
 */
const addMap = (NodeTypeArr, DomTypeArr, config) => {
  DomTypeArr.forEach((dom) => {
    dom.figmaNodeMap = {};
    NodeTypeArr.forEach((figmaNode) => {
      let { score, info } = calculateScore(figmaNode, dom, config);
      dom.figmaNodeMap[figmaNode.id] = {
        score,
        info,
        figmaNode
      }
    })
  })
}

/**
 * hhs
 * 匹配当前dom最佳的figmaNode
 * @param dom 
 * @param DomTypeArr 
 * @returns {figmaNode}
 */
const matchBestFigmaNodeToDom = (dom, DomTypeArr) => {
  const nodes: FigmaMapNode[] = Object.values(dom.figmaNodeMap)
  nodes.sort((a: FigmaMapNode, b: FigmaMapNode) => {  
    return b.score - a.score; // 降序排序  
  }); 
  let hasMatchedFigmaNode = false
  let loved = []

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    // 当前figmaNode是否符合匹配 最高分
    if (isMatchScoreStandard(node.info)) {
      // if (dom.className === 'dot') {
      //   debugger
      // }
      hasMatchedFigmaNode = true
      loved.push(node)
      if (!node.figmaNode.hasMatch) {
        if (i > 0) {
          // 最高得分的figmaNode已经被其他dom匹配
        }
        // 只处理双向奔赴
        const bestMatchDom = getHighestScoreDom(node.figmaNode, DomTypeArr);
        if (bestMatchDom === dom) {
          // 成功匹配，双向
          return node
        }
      } else {
        // figmaNode 已经被匹配
      }
    }
  }
  if (hasMatchedFigmaNode) {
    console.error('当前dom没有匹配到figmaNodes')
    console.log(dom.node)
    console.log(dom)
    console.log(loved)
  }
  // 如何获取异常情况呢?
  
  return {}
}


export const equal = (node: any, dom: any) => {
  const { width: domWidth, height: domHeight, top: domTop, left: domLeft } = dom;
  const { width: nodeWidth, height: nodeHeight, top: nodeTop, left: nodeLeft } = node;
  
  const errorRange = 1;
  if (!dom.textElementType && Math.abs(domWidth - nodeWidth) > errorRange) {
    return false
  }
  if (!dom.textElementType &&  Math.abs(domHeight - nodeHeight) > errorRange) {
    return false
  }
  if (Math.abs(domTop - nodeTop) > errorRange) {
    return false
  }
  if (Math.abs(domLeft - nodeLeft) > errorRange) {
    return false
  }
  return true
}

export const matchBest = (NodeTypeArr, DomTypeArr, config) => {
  // 每一个dom存储所有figmaNode的得分
  addMap(NodeTypeArr, DomTypeArr, config)
  for (let i = 0; i < DomTypeArr.length; i++) {
    const dom = DomTypeArr[i];
    const { figmaNode, info, score } = matchBestFigmaNodeToDom(dom, DomTypeArr)
    if (figmaNode) {
      figmaNode.hasMatch = true;
      dom.id = figmaNode.id; // 建立1v1关系
      dom.score = score;
      dom.name = figmaNode.name;
      dom.info = info
      dom.figmaNode = figmaNode
    }
  }
  return DomTypeArr
}

// 再匹配一次
export const matchBestAgain = (NodeTypeArr, DomTypeArr, config) => {
  // 每一个dom存储所有figmaNode的得分
  for (let i = 0; i < DomTypeArr.length; i++) {
    const dom = DomTypeArr[i];
    const { figmaNode, info, score } = matchBestFigmaNodeToDom(dom, DomTypeArr)
    if (figmaNode) {
      figmaNode.hasMatch = true;
      dom.id = figmaNode.id;
      dom.score = score;
      dom.name = figmaNode.name;
      dom.info = info
      dom.figmaNode = figmaNode
    }
  }
  return DomTypeArr
}



