import React, { useState } from 'react'
import Draggable from 'react-draggable';
import styles from './index.less'
import { InputNumber, Button } from "antd";
import { useConfigContext } from '@/Hooks/models/useConfigContext';

const ScoreConfig = () => {
  const { scoreConfig, dispatch } = useConfigContext();
  const { allowError: {
    height,
    width,
    top,
    left
  }, minScore } = scoreConfig;

  const [minScoreValue, setMinScoreValue] = useState(minScore)
  
  const [heightValue, setHeightValue] = useState(height)
  const [widthValue, setWidthValue] = useState(width)
  const [topValue, setTopValue] = useState(top)
  const [leftValue, setLeftValue] = useState(left)

  console.log('scoreConfig', scoreConfig, height)

  const update = () => {
    dispatch({
      type: 'updateState',
      payload: {
        scoreConfig: {
          allowError: {
            height: heightValue,
            width: widthValue,
            top: topValue,
            left: leftValue
          },
          minScore: minScoreValue
        }
      }
    })
  }

  return (
    <Draggable
      handle=".scoreConfigHeader"
    >
      <div className={styles.container}>
        <div className="scoreConfigHeader">评分细则</div>
        <div className={styles.center}>
          <div className={styles.item}>
            <span className={styles.label}>height 误差值:</span>
            <InputNumber max={10} min={0} value={heightValue} onChange={(v) => {setHeightValue(v)}}></InputNumber>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>width 误差值:</span>
            <InputNumber max={10} min={0} value={widthValue} onChange={(v) => {setWidthValue(v)}}></InputNumber>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>top 误差值:</span>
            <InputNumber max={10} min={0} value={topValue} onChange={(v) => {setTopValue(v)}}></InputNumber>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>left 误差值:</span>
            <InputNumber max={10} min={0} value={leftValue} onChange={(v) => {setLeftValue(v)}}></InputNumber>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>最低得分:</span>
            <InputNumber max={100} min={0} value={minScoreValue} onChange={(v) => {setMinScoreValue(v)}} ></InputNumber>
          </div>
          <div className={styles.item} style={{ flexDirection: 'row-reverse' }}>
            <Button style={{marginRight: '10px'}} onClick={update}>update</Button>
          </div>
        </div>
      </div> 
    </Draggable>
  )
}
export default ScoreConfig