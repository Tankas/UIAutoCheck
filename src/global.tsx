import './global.less'
import { isDev } from "./utils/env"

if (isDev) {
  document.domain = 'eeo.im'; 
}

document.title = 'UI走查'
