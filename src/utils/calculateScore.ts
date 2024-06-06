import { IFigmaNode, IDomNode, IScoreInfo } from '@/types/index'
const getScoreByX = (points: any, value: any) => {
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
function calculateDifferenceScore(value1: number, value2: number, slot: any) {
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

/**
 * border Radius 得分单独的得分机制
 * @param dom 
 * @param figNode 
 * @returns 
 */
export const calculateBorderRadiusScore = (dom: IDomNode, figNode: IFigmaNode, weightConfig: any) => {
  if (!weightConfig.borderRadius.open) {
    return {
      score: 0,
      maxScore: 0
    }
  }

  const { borderRadius } = dom.cssStyle;
  const borderRadiusValue = +window.parseFloat(borderRadius).toFixed(2)
  const figBorderRadiusValue = +window.parseFloat(figNode.cornerRadius).toFixed(2)
  if (borderRadiusValue == figBorderRadiusValue) {
    return {
      score: 1,
      maxScore: weightConfig.borderRadius.score
    }
  }
  // 没有设置 radius
  if (figBorderRadiusValue == 0) {
    return {
      score: 0,
      maxScore: weightConfig.borderRadius.score
    }
  }

  const score = 1 - Math.abs(figBorderRadiusValue - borderRadiusValue) / 100
  if (score < 0) {
    return {
      score: 0,
      maxScore: weightConfig.borderRadius.score
    } 
  }
  return {
    score,
    maxScore: weightConfig.borderRadius.score
  }
}


/**
 * 计算字体大小得分
 * @param dom 
 * @param figNode 
 * @returns 
 */
export const calculateFontSizeScore = (dom: IDomNode, figNode: IFigmaNode, weightConfig: any) => {
  if (!weightConfig.fontSize.open) {
    return {
      score: 0,
      maxScore: 0
    }
  }
  
  // 非文本节点 直接得分
  if (!dom.textElementType) {
    return {
      score: 1,
      maxScore: weightConfig.fontSize.score
    } 
  } else {
    if (figNode.type !== 'TEXT' && !figNode.fontStyle) {
      return {
        score: 0,
        maxScore: weightConfig.fontSize.score
      } 
    }
  }
  const { fontSize: figmaFontSize }: any = figNode.fontStyle;
  const { fontSize: domFontSize }: any = dom.cssStyle.fontStyle

  const figmaFontSizeValue  = +window.parseFloat(figmaFontSize).toFixed(2)
  const domFontSizeValue = +window.parseFloat(domFontSize).toFixed(2)

  if (figmaFontSizeValue === domFontSizeValue) {
    return {
      score: 1,
      maxScore: weightConfig.fontSize.score
    } 
  }
  return {
    score: 0,
    maxScore: weightConfig.fontSize.score
  } 
}


export const calculateFontWeightScore = (dom: IDomNode, figNode: IFigmaNode, weightConfig: any) => {
  if (!weightConfig.fontWeight.open) {
    return {
      score: 0,
      maxScore: 0
    }
  }
  // 非文本节点 直接得分
  if (!dom.textElementType) {
    return {
      score: 1,
      maxScore: weightConfig.fontWeight.score
    }
  } else {
    if (figNode.type !== 'TEXT' && !figNode.fontStyle) {
      return {
        score: 0,
        maxScore: weightConfig.fontWeight.score
      }
    }
  }
  const { fontWeight: figmaWeightSize }: any = figNode.fontStyle;
  const { fontWeight: domFontWeight }: any = dom.cssStyle.fontStyle

  const figmaFontWeightValue  = +window.parseFloat(figmaWeightSize).toFixed(2)
  const domFontWeightValue = +window.parseFloat(domFontWeight).toFixed(2)

  if (figmaFontWeightValue === domFontWeightValue) {
    return {
      score: 1,
      maxScore: weightConfig.fontWeight.score
    }
  }
  return {
    score: 0,
    maxScore: weightConfig.fontWeight.score
  }
}


/**
 * 计算width 得分
 * @param domNode 
 * @param figmaNode 
 * @param weightConfig 
 * @returns 
 */
export const calculateWidthScore = (domNode: IDomNode, figmaNode: IFigmaNode, weightConfig: any) => {
  if (!weightConfig.width.open) {
    return {
      score: 0,
      maxScore: 0
    }
  }
  // dom节点，里面都是文本，宽高特殊处理
  const isTextElement = domNode.textElementType;
  // domNode 里面只有文本，domNode 默认width height 都是正确的
  // 比较宽度和高度，权重为 10
  let score = calculateDifferenceScore(figmaNode.width, domNode.width, weightConfig.width.points) * weightConfig.width.score;
  if (isTextElement) {
    score = weightConfig.width.score
  }
  const maxScore = weightConfig.width.score
  return {
    score,
    maxScore
  }
}
/**
 * 计算height 得分
 * @param domNode 
 * @param figmaNode 
 * @param weightConfig 
 * @returns 
 */
export const calculateHeightScore = (domNode: IDomNode, figmaNode: IFigmaNode, weightConfig: any) => {
  if (!weightConfig.height.open) {
    return {
      score: 0,
      maxScore: 0
    }
  }
  let score = calculateDifferenceScore(figmaNode.height, domNode.height, weightConfig.height.points) * weightConfig.height.score;
  const maxScore = weightConfig.height.score
  return {
    score,
    maxScore
  }
}

/**
 * 计算height 得分
 * @param domNode 
 * @param figmaNode 
 * @param weightConfig 
 * @returns 
 */
export const calculateTopScore = (domNode: IDomNode, figmaNode: IFigmaNode, weightConfig: any) => {
  if (!weightConfig.top.open) {
    return {
      score: 0,
      maxScore: 0
    }
  }
  let score = calculateDifferenceScore(figmaNode.top, domNode.top, weightConfig.top.points) * weightConfig.top.score;
  const maxScore = weightConfig.top.score
  return {
    score,
    maxScore
  }
}

/**
 * 计算 left 得分
 * @param domNode 
 * @param figmaNode 
 * @param weightConfig 
 * @returns 
 */
export const calculateLeftScore = (domNode: IDomNode, figmaNode: IFigmaNode, weightConfig: any) => {
  if (!weightConfig.left.open) {
    return {
      score: 0,
      maxScore: 0
    }
  }
  let score = calculateDifferenceScore(figmaNode.left, domNode.left, weightConfig.left.points) * weightConfig.left.score;
  const maxScore = weightConfig.left.score
  return {
    score,
    maxScore
  }
}