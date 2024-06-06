import { useEffect, useContext } from 'react'
import style from './index.less'
import { isDev } from "@/utils/env"
import { useConfigContext } from '@/Hooks/models/useConfigContext'


const IframePage: React.FC<{url: string, domLoad: ({domNodes}: {
  domNodes: any[]
}) => void}> = ({domLoad, url}) => {
  
  const { deviceConfig } = useConfigContext()

  // 当接收到消息时的处理函数  
  function receiveMessage(event: any) {
    if (!event.data) {
      return
    }

    try {
      if (false) {
        const doms = event.source.sonDoms
        domLoad({
          domNodes: doms
        })
      } else {
        const data = JSON.parse(event.data)
        if (data?.type !== 'check') {
          console.warn('sdk 接入错误')
          return
        }
        const { doms } = data
        if (doms) {
          domLoad({
            domNodes: doms
          })
        }
      }
    } catch (er) {

    }

  }

  useEffect(() => {
    // 添加事件监听器来接收消息  
    window.addEventListener("message", receiveMessage, false);  

  }, [])

  const iframeLoad = () => {
    console.log('iframeLoad')
  }

  return (
    <div className={style.iframeWrapper} id='iframeWrapper' style={{width: `${deviceConfig.width}px`, height: `${deviceConfig.height}px`}}>
      <iframe onLoad={iframeLoad}  id='iframe' src={url} width={deviceConfig.width} height='100%' frameBorder={0}></iframe>
    </div>
  )

}

export default IframePage;