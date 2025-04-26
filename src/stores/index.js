import {defineStore} from "pinia"
import {ref} from "vue"

export const useAllDataStore=defineStore("allData",{
    state:()=>{
        return{
            isCollapse:false,
            tags:[
                {
                    path:'/home',
                    name:'home',
                    label:'首页',
                    icon:'home'
                }
            ],
            currentMenu:null,
            menuList:[],
            token:""
        }
    },
    getters:{
        changeCollapse(){
            this.isCollapse=!this.isCollapse;
        },
    },
    actions:{
        selectMenu(val){
            if(val.name==='home'){
                this.currentMenu=null
            }else{
                let index=this.tags.findIndex(item=>item.name===val.name);
                index===-1?this.tags.push(val) : "";
            }
        },
        updateTags(tag){
            let index=this.tags.findIndex(item=>item.name===tag.name);
            this.tags.splice(index,1);
        },
        updateMenuList(val){
            this.menuList=val;
        }
    }
})