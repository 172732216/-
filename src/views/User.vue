<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input placeholder="请输入用户名" v-model="formInline.keyWord"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="tableData" style="width: 100%">
        <el-table-column
            v-for="item in tableLabel"
            :key="item.prop"
            :widh="item.width?item.width:125"
            :prop="item.prop"
            :label="item.label"
        />
      
        <el-table-column fixed="right" label="Operations" min-width="140">
        <template #="scope">
            <el-button  type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button  type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
        </el-table-column>
        </el-table>
        <el-pagination
            class="pager"
            background
            layout="prev,pager,next"
            aria-setsize="small"
            :total="config.total"
            @current-change="handleChange">
        </el-pagination>
    </div>
    <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
    <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex" style="display: flex;">
            <el-select  v-model="formUser.sex" placeholder="请选择" >
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
          label="地址"
          prop="addr"
        >
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {ref,getCurrentInstance,onMounted, reactive,nextTick} from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
const handleClick = () => {
  console.log('click')
}
const tableData =ref([])
const tableLabel=reactive([
    {
        prop:'name',
        label:'姓名'
    },
    {
        prop:'age',
        label:'年龄'
    },
    {
        prop:'sexLabel',
        label:'性别'
    },
    {
        prop:'birth',
        label:'出生日期',
        width:200
    },
    {
        prop:'addr',
        label:'地址',
        width:400
    }

])
const formInline=reactive({
    keyWord:''
})
const config=reactive({
    name:'',
    total:0,
    page:1
})
const handleSearch=()=>{
    config.name=formInline.keyWord
    getUserData()
}
const handleChange=(page)=>{
    config.page=page
    getUserData()
}
const handleDelete=(val)=>{
    ElMessageBox.confirm("确定要删除吗？").then(async ()=>{
        await proxy.$api.deleteUser({id:val.id})
        ElMessage({
            showClose:true,
            message:'删除成功',
            type:'success'
        })
        getUserData()
    })
}
const {proxy}=getCurrentInstance()
const getUserData= async ()=>{
    let data= await proxy.$api.getUserData(config)
    tableData.value=data.list.map(item=>({
        ...item,
        sexLabel:parseInt(item.sex)===1?'男':'女'
    }))
    config.total=data.count
}
const action=ref('add')
const dialogVisible=ref(false)
const formUser=reactive({
   
})
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr:[{ required: true, message: '地址是必填项' }]
})
const handleAdd=()=>{
    dialogVisible.value=true
    action.value='add'
}
const handleClose=()=>{
    dialogVisible.value=false
    proxy.$refs['userForm'].resetFields()
}
const handleCancel=()=>{
    dialogVisible.value=false
    proxy.$refs['userForm'].resetFields()
}
const timeFormat=(time)=>{
    var time =new Date(time)
    var year=time.getFullYear()
    var month=time.getMonth()+1
    var date=time.getDate()
    function add(m){
        return m<10?"0"+m:m
    }
    return  year+"-"+add(month)+"-"+add(date)
}
const onSubmit=()=>{
    proxy.$refs['userForm'].validate(async (valid)=>{
        if(valid){
            let res=null;
            formUser.birth=/^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth : timeFormat(formUser.birth)
            if(action.value==='add'){
                res=await proxy.$api.addUser(formUser)
            }else{
                res=await proxy.$api.editUser(formUser)
            }
            if(res){
                dialogVisible.value=false
                proxy.$refs['userForm'].resetFields()
                getUserData()
            }
        }else{
            ElMessage({
                showClose:true,
                message:'请输入正确的内容',
            })
        }

    })
}
const handleEdit=(val)=>{
    action.value='edit'
    dialogVisible.value=true
    nextTick(()=>{
        Object.assign(formUser,{...val,sex:''+val.sex})
    })
}
onMounted(()=>{
    getUserData()
})
</script>

<style scoped lang="less">
.user-header{
    display: flex;
    justify-content: space-between;
}
.table{
    position: relative;
    .pager{
        position: absolute;
        right: 10px;
        bottom:-40px
    }
    .el-table{
        width: 100%;
        height:500px;
    }
}

</style>