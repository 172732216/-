import { createApp } from 'vue'
import './assets/less/index.less'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import "./api/mock"
import api from './api/api'
import { useAllDataStore } from './stores'
function isRoute(to){
    return router.getRoutes().filter(item=>item.path===to.path).length>0
}
router.beforeEach((to,from)=>{
    if(to.path!='/login'&&!store.state.token){
        return {name:"login"};
    }
    if(!isRoute(to)){
        return {name:"404"}
    }
})
const pinia = createPinia()
const app =createApp(App)
app.config.globalProperties.$api=api;
app.use(pinia)
const store=useAllDataStore();
app.use(ElementPlus)
store.addMenu(router,"refresh")
app.use(router)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
