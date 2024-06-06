import { createContext } from 'react';

export type IBaseConfig = {
  pageLink: string,
  figmaLink: string,
  figmaRootName: string,
  clientToolBarHeight: number
}

export type IWeightConfig = {
  width: any;
  height: any;
  top: any;
  left: any;
  borderRadius: any;
  fontSize: any;
  fontWeight: any;
}

export type IDeviceConfig = {
  width: number,
  height: number,
  scale: number,
}

export type IConfig = {
  baseConfig: IBaseConfig;
  deviceConfig: IDeviceConfig;
  weightConfig: IWeightConfig;
  scoreConfig: any;
}

export interface IConfigContext {
  state: IConfig;
  dispatch: Function;
}

export const ConfigContext = createContext<IConfigContext>(null);

// 默认权重配置
const defaultWeightConfig = {
  width: {
    weight: 1,
    score: 10,
    label: 'width',
    open: true,
    alias: {
      x: [0, 10, 50, 100],
      y: [100, 80, 20, 0]
    }
  },
  height: {
    weight: 1,
    score: 10,
    open: true,
    label: 'weight',
    alias: {
      x: [0, 10, 50, 100],
      y: [100, 80, 20, 0]
    }
  },
  top: {
    weight: 1,
    score: 8,
    open: true,
    label: 'top',
    alias: {
      x: [0, 10, 50, 100],
      y: [100, 80, 20, 0]
    }
  },
  left: {
    weight: 1,
    score: 8,
    open: true,
    label: 'left',
    alias: {
      x: [0, 10, 50, 100],
      y: [100, 80, 20, 0]
    }
  },
  borderRadius: {
    weight: 1,
    score: 1,
    open: true,
    label: 'borderRadius',
  },
  fontSize: {
    weight: 1,
    score: 1,
    open: true,
    label: 'fontSize',
  },
  fontWeight: {
    weight: 1,
    score: 1,
    open: true,
    label: 'fontWeight',
  },
}

const defaultBaseConfig = {
  pageLink: 'http://staticlocal.eeo.im:9090/courseware?key=eyJpdiI6InZzZ1RDUkZTTGtLZzRzQUZab21xQlE9PSIsInZhbHVlIjoib0hQVDZ0NUI1ZG5ueThYZDBTWmlCcFNWVHdvUVJGRlVRWVpucUs0L1dSUT0iLCJtYWMiOiJlNjQ5YWU5OGEwZDBjMDk2ODZhYTcwN2ExZjRjYTIyZDNiZjRkNDI2ODJiMWE5ZDQxZjlmY2FlNTUzNTUxZWViIiwidGFnIjoiIn0&lang=zh-CN',
  figmaLink: 'https://www.figma.com/file/t9226FSQpe7ppL1WnqN3C2/%E8%AF%BE%E5%89%8D%E8%AF%BE%E5%90%8E-%E5%BB%BA%E8%AF%BE%E3%80%81%E5%A4%87%E8%AF%BE%E5%AE%A4%E3%80%81%E8%AF%84%E4%BB%B7?type=design&node-id=6569-22673&mode=design&t=8frfOzf3rwrDOtJN-0',
  figmaRootName: '分享出去看到的页面',
  clientToolBarHeight: 88,
}

// defaultBaseConfig.pageLink = '';
// defaultBaseConfig.figmaLink = '';

export const initState = () => {
  return {
    baseConfig: {
      ...defaultBaseConfig,
    },
    deviceConfig: {
      width: 375,
      height: 1000,
      scale: 1,
    },
    weightConfig: {
      ...defaultWeightConfig
    },
    scoreConfig: {
      allowError: { // 允许的误差值，设计稿与实际尺寸，小于误差值，也算对
        height: 1,
        width: 0,
        top: 1,
        left: 0,
      },
      minScore: 90, // 最低分数,如果dom 的得分分低于这个值，则认为该dom没有匹配到设计稿中的元素
    }
  }
}

export const reducer = (state: IConfig, { type, payload }: {
  type: string,
  payload: any
}): IConfig => {
  switch (type) {
    case 'updateState':
      return {
        ...state,
        ...payload
    };
    default:
      return state;
  }
}