import { createContext } from 'react';

export const NodesContext = createContext<any>(null);

export const initState = () => {
  return {
    rightNodes: [],
    errorNodes: [],
    showRightNodes: false,
    showErrorNodes: false,
    nodeTableInfo: null,
    showNodeTable: false
  }
}

export const reducer = (state: any, { type, payload }: {
  type: string,
  payload: any
}) => {

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