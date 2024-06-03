import { IFigmaNode, IDomNode, IScoreInfo } from '@/types/index'


/**
 * border Radius 得分单独的得分机制
 * @param dom 
 * @param figNode 
 * @returns 
 */
export const calculateBorderRadiusScore = (dom: IDomNode, figNode: IFigmaNode) => {
  const { borderRadius } = dom.cssStyle;
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
 * 计算字体大小得分
 * @param dom 
 * @param figNode 
 * @returns 
 */
export const calculateFontSizeScore = (dom: IDomNode, figNode: IFigmaNode) => {
  // 非文本节点 直接得分
  if (!dom.textElementType) {
    return 1 
  } else {
    if (figNode.type !== 'TEXT' && !figNode.fontStyle) {
      return 0
    }
  }
  const { fontSize: figmaFontSize }: any = figNode.fontStyle;
  const { fontSize: domFontSize }: any = dom.cssStyle.fontStyle

  const figmaFontSizeValue  = +window.parseFloat(figmaFontSize).toFixed(2)
  const domFontSizeValue = +window.parseFloat(domFontSize).toFixed(2)

  if (figmaFontSizeValue === domFontSizeValue) {
    return 1
  }
  return 0
}


export const calculateFontWeightScore = (dom: IDomNode, figNode: IFigmaNode) => {
  // 非文本节点 直接得分
  if (!dom.textElementType) {
    return 1 
  } else {
    if (figNode.type !== 'TEXT' && !figNode.fontStyle) {
      return 0
    }
  }
  const { fontWeight: figmaWeightSize }: any = figNode.fontStyle;
  const { fontWeight: domFontWeight }: any = dom.cssStyle.fontStyle

  const figmaFontWeightValue  = +window.parseFloat(figmaWeightSize).toFixed(2)
  const domFontWeightValue = +window.parseFloat(domFontWeight).toFixed(2)

  if (figmaFontWeightValue === domFontWeightValue) {
    return 1
  }
  return 0
}