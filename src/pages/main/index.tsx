import React, { createContext, useContext, useEffect, useReducer } from "react";
import AppProvider from '@/components/AppProvider'
import App from "./app";

const Main = () => {
  return (
    <AppProvider>
      <App></App>
    </AppProvider>
  )
}

export default Main