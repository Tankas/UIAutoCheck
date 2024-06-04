import React, { createContext, useContext, useEffect, useReducer } from 'react';

import { ConfigContext, initState, reducer } from '@/models/config'

import { NodesContext, initState as nodesInitState, reducer as nodesReducer } from '@/models/nodes'

import { Context as UserContext, initState as userInitState, reducer as userReducer } from '@/models/user'

const AppProvider = ({
  children
}: any) => {

  const [state, dispatch] = useReducer(reducer, initState()); 

  const [nodesState, nodesDispatch] = useReducer(nodesReducer, nodesInitState()); 

  const [userState, userDispatch] = useReducer(userReducer, userInitState());

  return (
    <ConfigContext.Provider value={{state, dispatch}}>
      <NodesContext.Provider value={{state: nodesState, dispatch: nodesDispatch}}>
        <UserContext.Provider value={{state: userState, dispatch: userDispatch}}>
          {
            children
          }
        </UserContext.Provider>
        
      </NodesContext.Provider>
    </ConfigContext.Provider>
  )
}

export default AppProvider