import React, { createContext, useContext, useEffect, useReducer } from 'react';

import { ConfigContext, initState, reducer } from '@/models/config'

import { NodesContext, initState as nodesInitState, reducer as nodesReducer } from '@/models/nodes'


const AppProvider = ({
  children
}: any) => {

  const [state, dispatch] = useReducer(reducer, initState()); 

  const [nodesState, nodesDispatch] = useReducer(nodesReducer, nodesInitState()); 

  return (
    <ConfigContext.Provider value={{state, dispatch}}>
      <NodesContext.Provider value={{state: nodesState, dispatch: nodesDispatch}}>
        {
          children
        }
      </NodesContext.Provider>
    </ConfigContext.Provider>
  )
}

export default AppProvider