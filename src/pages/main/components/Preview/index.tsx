import { useEffect, useState } from 'react';
import styles from './index.less'
import { useConfigContext } from '@/Hooks/models/useConfigContext'
import { useUserContext } from '@/Hooks/models/useUserContext';
import { getImage, parseFigmaURL } from "@/utils/index";

export default function Preview(props: any) {



  const { baseConfig } = useConfigContext()
  const { showDesignPic } = useUserContext()

  const { figmaLink } = baseConfig
  const [ figmaSrc, setFigmaSrc ] = useState('')
  
  const aa = figmaLink;

  const getFigmaSrc = async () => {
    const { fileId, nodeId: nodeIds } = parseFigmaURL(figmaLink);
    const { data: {images} } = await getImage({
      fileId,
      nodeIds
    })
    const src= images[String(nodeIds).replace('-', ':')]
    setFigmaSrc(src)
  }

  console.log('figmaLink', figmaLink)

  useEffect(() => {
    if (figmaLink) {
      getFigmaSrc()
    }
  }, [aa])

  
  if (!showDesignPic) {
    return null
  }

  return (
    <>
      <div className={styles.content}>
        {
          figmaSrc ? 
          <img src={figmaSrc}></img> : ''
        }
      </div>
    </>
  );
}