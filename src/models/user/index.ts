import { createContext } from 'react';

export const Context = createContext<any>(null);

export type IUserInfo = {
  info: any;
}

export const initState = () => {
  return {
    userInfo: {}
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