<template>
    <el-row class="home" :gutter="20">
        <el-col :span="8" style="margin-top: 0px;">
            <el-card shadow="hover">
                <div class="user">
                    <img :src="getImageUrl('user')" class="user">
                    <div class="user-info">
                        <p class="user-info-admin">Admin</p>
                        <p class="user-info-p">超级管理员</p>
                    </div>
                </div>
                <div class="login-info">
                    <p>上次登录时间：<span>2024-06-30</span></p>
                    <p>上次登录地点：<span>北京</span></p>
                </div>
            </el-card>
            <el-card shadow="hover" class="user-table">
            <el-table :data="tableData">
                <el-table-column
                    v-for="(val,key) in tableLabel"
                    :key="key"
                    :prop="key"
                    :label="val"
                >

                </el-table-column>
            </el-table> 
        </el-card>
        </el-col>
        <el-col :span="16" style="margin-top: 0px;">
            <div class="num">
                <el-card
                :body-style="{display:'flex',padding:0}"
                v-for="item in countData"
                :key="item.name"
                >
                    <component :is="item.icon" class="icons" :style="{background:item.color}"></component>
                    <div class="detail">
                        <p class="num">￥{{ item.value }}</p>
                        <p class="txt">￥{{ item.name }}</p>
                    </div>
                </el-card>
            </div>
            <el-card class="top-echart" style="height: 245px;">
                <div ref="echart" style="height: 270px;"></div>
            </el-card>
            <div class="graph">
                <el-card>
                    <div ref="userEchart" style="height: 240px;"></div>
                </el-card>
                <el-card>
                    <div ref="videoEchart" style="height: 240px;"></div>
                </el-card>
            </div>
        </el-col>

    </el-row>
</template>

<script setup>
import { ref,reactive,getCurrentInstance,onMounted} from 'vue'
import * as echarts from 'echarts'
const {proxy}=getCurrentInstance();

const getImageUrl=(user)=>{
    return new URL(`../assets/images/${user}.png`,import.meta.url).href
}
const tableData = ref([
   
])
const countData = ref([
   
])
const chartData = ref([
   
])
const tableLabel = ref({
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
})
const observer = ref(null)
//这个是折线图和柱状图 两个图表共用的公共配置
const xOptions = reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      legend: {},
      grid: {
        left: "20%",
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
})
const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {},
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: []
})

const getTableData=async ()=>{
    const data=await proxy.$api.getTableData()
    tableData.value=data
}
const getCountData=async ()=>{
    const data=await proxy.$api.getCountData()
    countData.value=data
}
const getChartData=async ()=>{
    const {orderData,userData,videoData}=await proxy.$api.getChartData()
    //折线图
    xOptions.xAxis.data=orderData.date;
    xOptions.series=Object.keys(orderData.data[0]).map(val=>({
        name:val,
        data:orderData.data.map(item=>item[val]),
        type:'line'
    }))
    const oneEchart=echarts.init(proxy.$refs['echart'])
    oneEchart.setOption(xOptions)
    //柱状图
    xOptions.xAxis.data=userData.map(item=>item.date)
    xOptions.series=[
        {
            name:'新增用户',
            data:userData.map(item=>item.new),
            type:'bar'
        },
        {
            name:'活跃用户',
            data:userData.map(item=>item.active),
            type:'bar'
        },
    ]
    const twoEchart=echarts.init(proxy.$refs['userEchart'])
    twoEchart.setOption(xOptions)
    //饼图
    pieOptions.series=[{
        data:videoData,
        type:'pie'
    }]
    const threeEchart=echarts.init(proxy.$refs['videoEchart'])
    threeEchart.setOption(pieOptions)

    //监听页面变化
    observer.value=new ResizeObserver((en)=>{
        oneEchart.resize()
        twoEchart.resize()
        threeEchart.resize()
    })
    
    //容器存在
    if(proxy.$refs['echart']){
        observer.value.observe(proxy.$refs['echart'])
    }
   
}
onMounted(()=>{
    getTableData()
    getCountData()
    getChartData()
})
</script>



<style scoped lang="less">
.home{
    height: 100%;
    overflow: hidden;
    
    .user{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        img{
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-right: 40px;
        }
        .user-info{
            p{
                line-height: 40px;
            }
            .user-info-p{
                color: #999;
            }
            .user-info-admin{
                font-size: 35px;
            }
        }
    }
    .login-info{
        p{
            line-height: 30px;
            font-size:14px ;
            color: #999;
            span{
                color: #666;
                margin-left: 60px;
            }
        }
    }
    .user-table{
        margin-top: 20px;
    }
    .num{
        display:flex;
        flex-wrap:wrap;
        justify-content: space-between;
        .el-card{
            width: 32%;
            margin-bottom: 5px;
        }
        .icons{
            width: 80px;
            height: 60px;
            font-size: 30px;
            text-align: center;
            line-height: 60px;
            color: #fff;
        }
        .detail{
            margin-left: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .num{
                font-size: 30px;
                margin-bottom: 5px;
            }
            .txt{
                font-size: 15px;
                text-align: center;
                color: #999;
            }
        }
    }
    .graph{
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        .el-card{
            width: 48%;
            height: 250px;
        }
    }
}
</style>