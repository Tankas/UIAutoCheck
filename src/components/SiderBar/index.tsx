import styles from './index.less'

import Link from './components/Link'
import User from './components/User'
import { useLocation } from 'umi';


const SideBar = () => {

  const route  = useLocation()
  const { pathname } = route;

  return (
    <div className={styles.sidebar}>
      <User></User>
      <Link url='/main' name='主页' curPath={pathname} ></Link>
      <Link url='/config' name='配置' curPath={pathname}></Link>
    </div>
  )
}

export default SideBar