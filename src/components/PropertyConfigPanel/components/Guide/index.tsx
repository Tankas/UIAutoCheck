import React from "react";

const Guide: React.FC<any> = () => {

  const step = [
    {
      title: 'step 1',
      content: '对接业务项目中,html中引入sdk'
    },
    {
      title: 'step 2',
      content: '基础配置中,配置页面链接,Figma链接,跟节点名称'
    }
  ]

  return (
    <>
      <div>
        {
          step.map((item, index) => {
            return (
              <div key={index}>
                {item.title}: {item.content}
              </div>
            )
          })
        }
        <div className="scoreRule">
          评分标准: 
          1. 总得分不能低于 10
          2. width, height 得分不能低于 各自项最高得分的1%
          3. top left 得分不能低于 各自项最高得分的10%
        </div>
      </div>
    </>
  )
}

export default Guide;