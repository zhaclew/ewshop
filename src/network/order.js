import { request } from './request'

// 创建订单
export function createOrder(params){
  return request({
    url:'/api/orders',
    method:'post',
    params
  })
}

// 订单预览
export function getOrderPreview(){
  return request({
    url:'/api/orders/preview'
  })
}
 
// 支付订单，获取二维码
export function payOrder(order,params){
  return request({
    url:`/api/orders/${order}/pay`,
    params
  })
}

// 查询支付状态
export function payOrderStatus(order){
  return request({
    url:`/api/orders/${order}/status`,
  })
}

// 获取订单列表 { page:1, status:2, include:'user, orederDetail' }
export function getOrderList(params){
  return request({
    url:'/api/orders',
    params
  })
}

// 订单详情
export function getOrderDetail(order){
  return request({
    url:`/api/orders/${order}`,
    params:{
      include:'user, orderDetails,goods'
    }

  })
}

// 物流详情
export function viewExpress(order){
  return request({
    url:`/api/orders/${order}/express`
  })
}

// 确认收货
export function confirmOrder(order){
  return request({
    url:`/api/orders/${order}/confirm`,
    method:'PATCH'
  })
}

// 评价商品
export function comment(id){
  return request({
    url:`/api/orders/${id}/comment`,
    method:'post'
  })
}