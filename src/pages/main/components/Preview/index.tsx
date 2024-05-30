import { useEffect, useState } from 'react';
import style from './index.less'
import { useConfigContext } from '@/Hooks/models/useConfigContext'

import { getImage, parseFigmaURL } from "@/utils/index";

export default function Preview(props: any) {

  const { baseConfig } = useConfigContext()
  const { figmaLink } = baseConfig
  const [ figmaSrc, setFigmaSrc ] = useState('https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2d79c884-0336-4fe5-be3a-6d2195f520b2')
  
  useEffect(() => {
    if (figmaLink) {
      const { fileId, nodeId: nodeIds } = parseFigmaURL(figmaLink);
      getImage({
        fileId,
        nodeIds
      })
    }
  }, [figmaLink])

  return (
    <>
      <div className='content'>
        {
          figmaSrc ? 
          <img src={figmaSrc}></img> : ''
        }
      </div>
    </>
  );
}