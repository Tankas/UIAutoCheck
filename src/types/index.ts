
export type IScoreInfo = {
  widthScore: number;
  heightScore: number;
  topScore: number;
  leftScore: number;
  borderRadiusScore: number;
  totalScore: number;
  fontSizeScore: number;
  fontWeightScore: number;
}

export type IDomNode = {
  id: string;
  nodeType: any;
  childElementCount: any;
  width: any;
  height: any;
  left: any;
  top: any;
  cssStyle: {
    borderRadius: any;
    fontStyle?: IFontStyle;
  };
  node?: any; // dom 节点 开发环境调试用
  figmaNode?: IFigmaNode; // 对应的figmaNode节点
  figmaNodeMap?: any; // 单个dom 对于所有所有figmaNode节点信息
  textElementType?: any; // 是否是文本节点 <P>文本</P>
  score?: number; // 得分
  name?: string; // figma Node name 暂时不用
  info?: IScoreInfo;
}
// 文本属性
export type IFontStyle = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
}

export type IFigmaNode = {
  id: string;
  parentId: string;
  width: number;
  height: number;
  left: number;
  top: number;
  name: string;
  type: string; // 暂时没有用到
  cornerRadius: string; // '1px'
  node: any; // 节点本身
  hasMatch?: any;
  fontStyle?: IFontStyle;
}