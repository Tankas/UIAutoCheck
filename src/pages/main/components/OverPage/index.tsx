import MarkingItem from '../MarkingItem'
import { useNodeContext } from '@/Hooks/models/useNodeContext'



const OverPage = ({
  domNodes
}: {
  domNodes: any[]
}) => {

  const { dispatch } = useNodeContext();

  if (domNodes.length === 0) {
    return null
  }

  const clickMarkingItem = (nodeInfo) => {
    dispatch({
      type: 'updateState',
      payload: {
        nodeTableInfo: nodeInfo,
        showNodeTable: true
      }
    })
  }

  return (
    <>
    {
      domNodes.map((domStyle) => {
        return (
          <MarkingItem key={domStyle.id} node={domStyle} onClick={clickMarkingItem}></MarkingItem>
        )
      })
    }
  </>
  )
}

export default OverPage