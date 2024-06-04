// 显示用户头像，点击用户头像，弹出登陆框、

import React, { useState } from 'react';
import styles from './index.less'

import { useUserContext } from '@/Hooks/models/useUserContext';

const User = () => {

  const login = () => {}

  const dd = useUserContext();

  console.log('用户信息', dd)


  return (
    <div className={styles.user}>
      <div className={styles.headPhoto} onClick={login}>
        <img style={{height: '100%', width: '100%' }} src='http://tankas.cn/public/defaultPhoto.png' alt="hh" />
      </div>
    </div>
  )
}

export default User;