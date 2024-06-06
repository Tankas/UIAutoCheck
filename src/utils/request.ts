import axios from "axios";

const isPro = window.location.origin === 'http://tankas.cn'


export const post = async (path: string, argus: any) => {
  let fullPath = isPro ? `http://tankas.cn/chat${path.replace(/^\/api/, '')}` : path
  return new Promise((resolve, reject) => {
    axios.post(fullPath, argus).then((data) => {
      const { code, data: dat, msg } = data.data;
      if (code === 1) {
        resolve(dat)
      } else {
        reject({
          msg,
        })
      }
      
    }).catch((error) => {
      reject({
        data: {},
        msg: error
      })
    })
  })
}