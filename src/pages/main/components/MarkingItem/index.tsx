import React from "react";
import styles from './index.less'

export type IMarkingProp = {
  node: any;
  style?: any;
  onClick?: (node: any) => void;
}

const MarkingItem: React.FC<any> = ({
  node,
  onClick
}) => {
  const { width, height, top, left } = node
  const style: any = {
    width,
    height,
    top,
    left,
  }
  return (
    <>
      <div style={style} className={styles.item} onClick={() => {
        onClick && onClick(node)
      }}>
      </div>
    </>
  )
}

export default MarkingItem;