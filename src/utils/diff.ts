
import { IFigmaNode, IDomNode, IScoreInfo } from '@/types/index'

import {
  calculateWidthScore,
  calculateHeightScore,
  calculateTopScore,
  calculateLeftScore,
  calculateBorderRadiusScore,
  calculateFontSizeScore,
  calculateFontWeightScore
} from './calculateScore'

export function parseFigmaURL(url: string) {  
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

/**
 * 总分 36
 * @param figmaNode 
 * @param domNode 
 * @param maxDiff 
 * @returns 
 */
export function calculateScore(figmaNode: IFigmaNode, domNode:IDomNode, weightConfig: any, scoreConfig) {
  const info: IScoreInfo = {
    widthScore: 0,
    heightScore: 0,
    topScore: 0,
    leftScore: 0,
    borderRadiusScore: 0,
    totalScore: 0,
    fontSizeScore: 0,
    fontWeightScore: 0,
    maxScore: 0, // 满分
  }
  // 计算 css width
  const { score: widthScore , maxScore: widthMaxScore } = calculateWidthScore(domNode, figmaNode, weightConfig);
  info.widthScore = widthScore;
  info.totalScore += widthScore;
  info.maxScore += widthMaxScore;
  // 计算 css height
  const { score: heightScore , maxScore: heightMaxScore } = calculateHeightScore(domNode, figmaNode, weightConfig);
  info.heightScore = heightScore;
  info.totalScore += heightScore;
  info.maxScore += heightMaxScore;
  // 计算 css top
  const { score: topScore , maxScore: topMaxScore } = calculateTopScore(domNode, figmaNode, weightConfig);
  info.topScore = topScore;
  info.totalScore += topScore;
  info.maxScore += topMaxScore;
  // 计算 css left
  const { score: leftScore , maxScore: leftMaxScore } = calculateLeftScore(domNode, figmaNode, weightConfig);
  info.leftScore = leftScore;
  info.totalScore += leftScore;
  info.maxScore += leftMaxScore;
  
  // 计算 css border radius
  const { score: borderRadiusScore, maxScore: borderRadiusMaxScore  } = calculateBorderRadiusScore(domNode, figmaNode, weightConfig)
  info.borderRadiusScore = borderRadiusScore;
  info.totalScore += borderRadiusScore
  info.maxScore += borderRadiusMaxScore
  // 计算 font size 
  const { score: fontSizeScore, maxScore: fontSizeMaxScore } = calculateFontSizeScore(domNode, figmaNode, weightConfig)
  info.fontSizeScore = fontSizeScore;
  info.totalScore += fontSizeScore;
  info.maxScore += fontSizeMaxScore;
  // 计算 fontWeight
  const { score: fontWeightScore, maxScore: fontWeightMaxScore } = calculateFontWeightScore(domNode, figmaNode, weightConfig)
  info.fontWeightScore = fontWeightScore;
  info.totalScore += fontWeightScore;
  info.maxScore += fontWeightMaxScore;
  
  return {
    score: info.totalScore,
    info
  };
}

/**
 * 评分标准
 * 1. 总得分不能低于 10
 * 2. width, height 得分不能低于 各自项最高得分的1%, 
 *  文本节点，宽度默认正确，无法和UI对其
 * 3. top left 得分不能低于 各自项最高得分的10%
 */
const isMatchScoreStandard = (info: IScoreInfo, scoreConfig: any) => {
  const { totalScore, widthScore, heightScore, topScore, leftScore,  maxScore } = info;
  const rate = scoreConfig.minScore / 100;
  const passScore = maxScore * rate;

  console.log('通过得分', passScore)

  if (totalScore >= passScore) {
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
const getHighestScoreDom = (figmaNode: IFigmaNode, DomTypeArr: IDomNode[]) => {
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
  score: number;
  info: IScoreInfo;
  figmaNode: IFigmaNode;
}

/**
 * 每一个dom figmaNodeMap 存储所有figmaNode的得分
 * @param figmaNodes 
 * @param domNodes 
 * @param config 
 */
const addFigmaNodeMap = (figmaNodes: IFigmaNode[], domNodes: IDomNode[], weightConfig: any, scoreConfig: any) => {
  domNodes.forEach((dom) => {
    dom.figmaNodeMap = {};
    figmaNodes.forEach((figmaNode) => {
      let { score, info } = calculateScore(figmaNode, dom, weightConfig, scoreConfig);
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
const matchBestFigmaNodeToDom = (dom: IDomNode, DomTypeArr: IDomNode[], scoreConfig: any) : FigmaMapNode | any => {
  const nodes: FigmaMapNode[] = Object.values(dom.figmaNodeMap)
  nodes.sort((a: FigmaMapNode, b: FigmaMapNode) => {  
    return b.score - a.score; // 降序排序  
  }); 
  let hasMatchedFigmaNode = false
  let loved = []

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    // 当前figmaNode是否符合匹配 最高分
    if (isMatchScoreStandard(node.info, scoreConfig)) {
      hasMatchedFigmaNode = true
      loved.push(node)
      if (!node.figmaNode.hasMatch) {
        if (i > 0) {
          // 最高得分的figmaNode已经被其他dom匹配
        }
        // 只处理双向奔赴
        const bestMatchDom = getHighestScoreDom(node.figmaNode, DomTypeArr);
        if (bestMatchDom === dom) {
          // 如果figma node 的children 和 当前figmaNode的得分一样，则以chilren 优先级更高
          const sonFigmaId = node.figmaNode.node?.children?.[0].id
          if (sonFigmaId) {
            const sonScore = dom.figmaNodeMap[sonFigmaId].score
            if (sonScore === node.score) {
              return dom.figmaNodeMap[sonFigmaId]
            }
          }
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

/**
 * 判断 figmaNode node 是否一致
 * @param node figmaNode
 * @param dom domNode
 * @returns 
 */
export const equal = (node: any, dom: any, scoreConfig: any) => {
  // 是否可以以满分来判断？？
  const { width: domWidth, height: domHeight, top: domTop, left: domLeft } = dom;
  const { width: nodeWidth, height: nodeHeight, top: nodeTop, left: nodeLeft } = node;
  // dom节点，里面都是文本，宽高特殊处理
  const isTextElement = dom.textElementType;
  const { allowError: {
    height: errorHeight,
    width: errorWidth,
    top: errorTop,
    left: errorLeft,
  } } = scoreConfig;
  
  if (!isTextElement && Math.abs(domWidth - nodeWidth) > errorWidth) {
    return false
  }
  if (Math.abs(domHeight - nodeHeight) > errorHeight) {
    return false
  }
  if (Math.abs(domTop - nodeTop) > errorTop) {
    return false
  }
  if (Math.abs(domLeft - nodeLeft) > errorLeft) {
    return false
  }
  return true
}


/**
 * 叶子结点，显示在页面上的，没有被匹配到的
 * @param domNodes 
 * @returns 
 */
const getNotMatchedDoms = (domNodes: IDomNode[]) => {
  const notMatchedDoms = domNodes.filter((v) => {
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
  return {
    notMatchedDoms
  }
}
/**
 * 获取被match的doms 包括完全正确的 和 属性值错误的
 * @param figmaNodes 
 * @param domNodes 
 * @returns 
 */
const getMatchedDoms = (figmaNodes: IFigmaNode[], domNodes: IDomNode[], scoreConfig: any) => {
  const rightDoms: IDomNode[] = [];
  const errorDoms: IDomNode[] = [];
  figmaNodes.forEach((node: any) => {
    const dom: any = domNodes.find(item => item.id === node.id);
    if (!dom) {
      // console.log('当前node没有找到匹配到的dom', node)
    } else if (equal(node, dom, scoreConfig)) {
      rightDoms.push(dom)        
    } else {
      errorDoms.push(dom)
    }
  })
  return {
    rightDoms,
    errorDoms
  }
}

export const diff = (figmaNodes: IFigmaNode[], domNodes: IDomNode[], config: any, scoreConfig: any) => {
  // 给所有的dom配置属性
  addFigmaNodeMap(figmaNodes, domNodes, config, scoreConfig)
  //
  setFigmaInfoToDom(domNodes, scoreConfig)
  // 取出所有匹配正确的
  const { rightDoms, errorDoms } = getMatchedDoms(figmaNodes, domNodes, scoreConfig)
  // 取出有得分但属性错误的
  // 取出完全对不上的
  const { notMatchedDoms } = getNotMatchedDoms(domNodes);
  // 再匹配一次
  setFigmaInfoToDom(notMatchedDoms, scoreConfig)
  const { rightDoms: rightDoms2, errorDoms: errorDoms2 } = getMatchedDoms(figmaNodes, notMatchedDoms, scoreConfig)

  return {
    rightDoms: [...rightDoms, ...rightDoms2],
    errorDoms: [...errorDoms, ...errorDoms2]
  }
}
/**
 * 如果dom 有最佳匹配的figma 就赋值figmaNode 信息
 * @param DomTypeArr 
 * @returns 
 */
export const setFigmaInfoToDom = (DomTypeArr: IDomNode[], scoreConfig: any) => {
  for (let i = 0; i < DomTypeArr.length; i++) {
    const dom = DomTypeArr[i];
    const { figmaNode, info, score } = matchBestFigmaNodeToDom(dom, DomTypeArr, scoreConfig)
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




