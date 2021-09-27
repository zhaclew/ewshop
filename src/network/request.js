import axios from 'axios';
import {Notify, Toast} from 'vant';

export function request(config) {
  const instance = axios.create({
    baseURL: 'https://api.shop.eduwork.cn/',
    timeout:500000
  })
  // 响应请求
  instance.interceptors.request.use(config=>{
    // 如果有一个接口需要认证才可以访问，就这里统一设置
    const token = window.localStorage.getItem('token')
    if (token){
      config.headers.Authorization = 'Bearer '+ token;
    }
    // 直接放行
    return config;
  }, err=>{

  })

  // 响应拦截
  instance.interceptors.response.use(res => {
    return res.data?res.data:res;
  },err =>{
    console.log(err);
    if (err.response.status === 401){
      Toast.fail('请先登录')
    }
    Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0])

  })

  return instance(config)
}
