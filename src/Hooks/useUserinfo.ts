import { useState, useEffect } from "react";
import { post } from "@/utils/request";
import { useUserContext } from "./models/useUserContext";


export const useUserinfo = () => {
  const [userInfo, setUserInfo] = useState({})

  const { dispatch } = useUserContext();
  const action = () => {
    post('/api/getUserInfo', {}).then((data: any) => {
      setUserInfo(data.info)
      dispatch({
        type: 'updateState', 
        payload: {
          userInfo: data.info
        }
      })
      console.log('data.info', data.info)
    }).catch((err) => {
      console.warn(err)
      setUserInfo(err) 
      dispatch({
        type: 'updateState', 
        payload: {
          showLoginWrapper: true
        }
      }) 
    })
  }
  useEffect( () => {
    action()
  }, [])
  
  return [userInfo, setUserInfo, action]
}