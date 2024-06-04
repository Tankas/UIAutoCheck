import React from "react"

import { history } from "umi"
import styles from './index.less'

type ILink = {
  name: string;
  url: string;
  curPath: string;
}


const Link: React.FC<ILink> = ({
  name, url, curPath
}) => {

  const handleClick = () => {
    history.push(url)
  }

  const isSelect = curPath === url

  return (
    <div className={styles.link} onClick={handleClick}>
      <p className={isSelect ? `${styles.linkContainer} ${styles.selected}` : `${styles.linkContainer}`}>
        {name}
      </p>
    </div>
  )
}

export default Link