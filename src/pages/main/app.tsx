import Center from './components/Center'
import { ConfigProvider } from 'antd'

import ScoreConfig from '@/components/PropertyConfigPanel/components/ScoreConfig' 
import DiffDimension from '@/components/PropertyConfigPanel/components/DiffDimension'
import { useUserContext } from '@/Hooks/models/useUserContext'

const App = () => {
  const { showScoreConfigWrapper, showDiffDimension } = useUserContext()
  return (
    <ConfigProvider>
      <Center></Center>
      {
        showScoreConfigWrapper ? <ScoreConfig></ScoreConfig> : null
      }
      {
        showDiffDimension ? <DiffDimension></DiffDimension> : null
      }
    </ConfigProvider>
  )
}

export default App