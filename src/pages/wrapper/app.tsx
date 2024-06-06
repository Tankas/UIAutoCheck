import { Outlet } from 'umi';
import SideBar from '@/components/SiderBar';
import styles from './index.less'
import Login from '@/components/Login'
import { useLogin } from '@/Hooks/useLogin'

const App = () => {
  const { isLogin } = useLogin()
  return (
    <>
      {
        isLogin ? <div className={styles.wrapper}>
        <div className={styles.left}>
          <SideBar></SideBar>
        </div>
        <div className={styles.right}>
          <Outlet></Outlet>
        </div>
      </div> : null
      }
      <Login></Login>
    </>
  )
}

export default App