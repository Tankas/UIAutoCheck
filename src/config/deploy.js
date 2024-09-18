#!/usr/bin/env node

const { exec, execSync } = require('child_process')
const path = require('path')

console.log('开始打包')
execSync('npm run build', {
  stdio: 'inherit'
})

console.log('开始部署')
const distPath = path.resolve(process.cwd(), 'dist') + '/*'

const rootPath = 'root@49.232.253.184:/usr/local/lighthouse/softwares/check'

exec(`scp -r ${distPath} ${rootPath}`, (err, stdout, stderr) => {
  if (err) {
    console.log('err', err)
    return 
  }
  console.log('部署成功')
})