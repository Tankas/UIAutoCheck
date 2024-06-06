import AppProvider from '@/components/AppProvider'
import App from './app'

const Wrapper = () => {

  return (
    <AppProvider>
      <App></App>
    </AppProvider>
  )
}

export default Wrapper