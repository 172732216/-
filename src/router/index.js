import { createRouter, createWebHashHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Mall from '../views/Mall.vue'
import Login from '../views/Login.vue'
const routes = [
    {
      path: '/',
      name: 'main',
      component:Main,
      redirect:'/home',
      children:[]
    },
    {
      path:"/login",
      name:"login",
      component:Login
    },
    {
      path:"/404",
      name:"404",
      component:() => import('../views/404.vue')
    },
  ]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default  router
