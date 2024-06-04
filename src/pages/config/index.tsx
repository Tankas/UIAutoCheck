import React, { createContext, useContext, useEffect, useReducer } from "react";
import AppProvider from '@/components/AppProvider'

import PropertyConfigPanel from '@/components/PropertyConfigPanel'


const Config = () => {
  return (
    <AppProvider>
      <PropertyConfigPanel></PropertyConfigPanel>
    </AppProvider>
  )
}

export default Config