// 显示用户头像，点击用户头像，弹出登陆框、

import React, { useState } from 'react';
import styles from './index.less'

import { useUserContext } from '@/Hooks/models/useUserContext';
import { useLogin } from '@/Hooks/useLogin';

const User = () => {
  
  const { dispatch } = useUserContext();
  const { isLogin } = useLogin();

  const showLoginWrapper = () => {
    dispatch({
      type: 'updateState',
      payload: {
        showLoginWrapper: true
      }
    })
  }

  return (
    <div className={styles.user}>
      {
        isLogin ? 
        <div className={styles.headPhoto}>
          <img style={{height: '100%', width: '100%' }} src='http://tankas.cn/public/defaultPhoto.png' alt="hhs" />
        </div> : 
        <div className={styles.headPhoto} onClick={showLoginWrapper}>
          <img style={{height: '100%', width: '100%' }} src='http://tankas.cn/public/defaultPhoto.png' alt="hhs" />
        </div>
      }
    </div>
  )
}

export default User;