import React, { useEffect } from "react";
import * as echarts from 'echarts';

const LineChart = () => {
  const domRef = React.useRef(null);
  const points = [
    {
      x: 0,
      y: 100,
    },
    {
      x: 10,
      y: 80,
    },
    {
      x: 50,
      y: 20,
    },
    {
      x: 100,
      y: 0,
    },
  ]
  const data = points.map(point => [point.x, point.y]);  
  useEffect(() => {
    const myChart = echarts.init(domRef.current);
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'value',
        name: '误差值'
      },
      yAxis: {
        type: 'value',
        name: '得分'
      },
      series: [
        {
          data: data,
          type: 'line'
        }
      ]
    };
    myChart.setOption(option)
  }, [])

  return (
    <>
      <div className="111111" style={{height: '300px', width: '500px'}} ref={domRef}>图标</div>
    </>
  )
}

export default LineChart