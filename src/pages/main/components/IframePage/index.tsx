import { useEffect, useContext } from 'react'
import style from './index.less'


const IframePage: React.FC<{url: string, domLoad: ({domNodes}: {
  domNodes: any[]
}) => void}> = ({domLoad, url}) => {
  
  // const { deviceConfig } = useContext(tableContext)
  const deviceConfig = {
    width: 375,
    // width: 544,
    height: 1000,
    scale: 1,
  }

  // 当接收到消息时的处理函数  
  function receiveMessage(event: any) {
    // 可以通过event.origin来检查消息来源的域，增加安全性  
    if (!event.origin.includes('9090')) { // 替换为子页面的实际来源域  
      return;
    }

    const idDev = true;
    if (idDev) {
      const doms = event.source.sonDoms
      domLoad({
        domNodes: doms
      })
    } else {
      const data = JSON.parse(event.data)
      const { doms } = data
      console.log('0000000', data)
      console.log(doms)
      if (doms) {
        domLoad({
          domNodes: doms
        })
      }
    }
    // 处理接收到的消息...  
  }

  useEffect(() => {
    // 添加事件监听器来接收消息  
    window.addEventListener("message", receiveMessage, false);  
    console.log('监听自页面消息')
  }, [])

  const iframeLoad = () => {

  }

  return (
    <div className={style.iframeWrapper} id='iframeWrapper' style={{width: `${deviceConfig.width}px`, height: `${deviceConfig.height}px`}}>
      <iframe onLoad={iframeLoad}  id='iframe' src={url} width={deviceConfig.width} height='100%' frameBorder={0}></iframe>
    </div>
  )

}

export default IframePage;