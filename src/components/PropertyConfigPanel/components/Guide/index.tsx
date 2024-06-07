import React from "react";
const Guide: React.FC<any> = () => {

  const step = [
    {
      title: 'step 1',
      content: '对接业务项目中,html中引入sdk. <script src="http://tankas.cn/check/ui-check-sdk.js"></script>'
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
      </div>
    </>
  )
}

export default Guide;