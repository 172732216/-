import {defineStore} from "pinia"
import {ref} from "vue"

export const useAllDataStore=defineStore("allData",{
    state:()=>{
        return{
            isCollapse:false
        }
    },
    getters:{
        changeCollapse(){
            this.isCollapse=!this.isCollapse;
        }
    },
    actions:{}
    }
)