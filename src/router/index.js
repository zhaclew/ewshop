import { Notify } from 'vant'
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
const Home = () => import('../views/Home.vue')
const Category = () => import('../views/category/Category.vue')
const Detail = () => import('../views/detail/Detail.vue')
const Profile = () => import('../views/profile/Profile.vue')
const ShopCart = () => import('../views/shopcart/ShopCart.vue')
const Register = () => import('../views/profile/Register.vue')
const Login = () => import('../views/profile/Login.vue')
const Address = () => import('../views/profile/Address.vue')
const AddressEdit = () => import('../views/profile/AddressEdit.vue')
const Order = () => import('../views/order/Order.vue')
const CreateOrder = () => import('../views/order/CreateOrder.vue')
const OrderDetail = () => import('../views/order/OrderDetail.vue')

const routes = [
  {
    path: '',
    name: 'DefaultHome',
    component: Home,
    meta: { title: '图书商城' }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: '图书商城'}
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta: { title: '图书商城-商品分类' }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta: { title: '图书商城-商品详情', needLogin: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '图书商城-个人中心',needLogin: true }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
    meta: { title: '图书商城-购物车', needLogin: true  }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册登录' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '注册登录' }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta: { title: '地址管理', needLogin: true }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta: { title: '地址编辑', needLogin: true }
  },
  {
    path: '/order',
    name: 'Order',
    component: Order,
    meta: { title: '订单界面', needLogin: true }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta: { title: '订单预览', needLogin: true }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { title: '订单详情', needLogin: true }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
//导航守卫
router.beforeEach((to, from, next) => {
  // 如果没有登录，在这里到login
  if(to.meta.needLogin && !window.localStorage.getItem("token")){
    Notify('您还未登录，请先登录')
   return next('/login')
  }else{
    next()
  }
  store.dispatch('updateCart')
  document.title = to.meta.title
})
export default router
