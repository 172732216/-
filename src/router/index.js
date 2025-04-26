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
      children:[
        {
            path: 'home',
            name: 'home',
            component:Home,
        },
        {
          path: 'user',
          name: 'user',
          component:User,
        },
        {
          path: 'mall',
          name: 'mall',
          component:Mall,
        }
      ]
    },
    {
      path:"/login",
      name:"login",
      component:Login
    }
  ]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default  router
