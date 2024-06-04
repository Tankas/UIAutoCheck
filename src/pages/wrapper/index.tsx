import { Outlet } from 'umi';
import AppProvider from '@/components/AppProvider'
import SideBar from '@/components/SiderBar';
import styles from './index.less'

const Wrapper = () => {
  return (
    <AppProvider>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <SideBar></SideBar>
        </div>
        <div className={styles.right}>
          <Outlet></Outlet>
        </div>
        
      </div>
    </AppProvider>
  )
}

export default Wrapper