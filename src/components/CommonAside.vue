<template>
    <el-aside :width="width">
        <el-menu
        background-color="#545c64"
        text-color="#fff"
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
        >
            <h3 v-show="!isCollapse">通用后台管理系统</h3>
            <h3 v-show="isCollapse">后台</h3>
            <el-menu-item 
                v-for="item in noChildren"
                :index="item.path"
                :key="item.path"
                @click="handleMenu(item)"
            >
                <component class="icons" :is="item.icon"></component>
                <span>{{ item.label }}</span>
            </el-menu-item>
            
            <el-sub-menu 
                v-for="item in hasChildren"
                :index="item.path"
                :key="item.path">
                <template #title>
                    <el-icon class="icons" :is="item.icon"><location /></el-icon>
                    <span>{{ item.label }}</span>
                </template>
                <el-menu-item-group >
                    <el-menu-item
                        v-for="(subItem,subIndex) in item.children"
                        :index="subItem.path"
                        :key="subItem.path"
                         @click="handleMenu(subItem)"
                    >
                        <el-icon class="icons" :is="subItem.icon"><location /></el-icon>
                        <span>{{ subItem.label }}</span>
                    </el-menu-item>  
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<script setup="CommonAside">
import {ref,computed} from "vue"
import { useAllDataStore } from "../stores"
import { useRoute,useRouter } from "vue-router"

const noChildren=computed(()=>list.value.filter(item=>!item.children))
const hasChildren=computed(()=>list.value.filter(item=>item.children))
const store=useAllDataStore();
const isCollapse=computed(()=>store.state.isCollapse)
const width=computed(()=>store.state.isCollapse?'64px':'180px')
const route=useRoute()
const router=useRouter()
const activeMenu=computed(()=>route.path)
const list=computed(()=>store.state.menuList)
const handleMenu=(item)=>{
    router.push(item.path)
    store.selectMenu(item)
}

</script>

<style lang="less" scoped>
.icons{
    width: 18px;
    height: 18px;
    margin-right: 5px;
}
.el-menu{
    border-right: none;
    h3{
        line-height: 48px;
        color:#fff;
        text-align: center;
    }
}
.el-aside{
    height: 100%;
    background-color: #545c64;
}
</style>