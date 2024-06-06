import Center from './components/Center'
import { ConfigProvider } from 'antd'

import ScoreConfig from '@/components/PropertyConfigPanel/components/ScoreConfig' 

import { useUserContext } from '@/Hooks/models/useUserContext'

const App = () => {
  const { showScoreConfigWrapper } = useUserContext()
  return (
    <ConfigProvider>
      <Center></Center>
      {
        showScoreConfigWrapper ? <ScoreConfig></ScoreConfig> : null
      }
    </ConfigProvider>
  )
}

export default App