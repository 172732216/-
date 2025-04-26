import Mock from "mockjs"
import homeApi from "./mockData/home"
import userApi from "./mockData/user"
import permissionApi from './mockData/permission'
Mock.mock(/api\/home\/getTableData/,"get", homeApi.getTableData)
Mock.mock(/api\/home\/getCountData/,"get", homeApi.getCountData)
Mock.mock(/api\/home\/getChartData/,"get", homeApi.getChartData)
Mock.mock(/api\/home\/getUserData/,"get", userApi.getUserList)
Mock.mock(/api\/home\/deleteUser/,"get", userApi.deleteUser)
Mock.mock(/api\/home\/addUser/,"post", userApi.createUser)
Mock.mock(/api\/home\/editUser/,"post", userApi.updateUser)
Mock.mock(/permission\/getMenu/, "post",permissionApi.getMenu)