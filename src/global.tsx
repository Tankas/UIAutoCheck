import { isDev } from "./utils/env"

console.log('global')
console.log(process.env)

console.log(isDev)

if (isDev) {
  document.domain = 'eeo.im'; 
}
document.domain = 'eeo.im'; 
