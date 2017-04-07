<template lang="pug">
  .app
    h1 exapmle
    el-button(type="primary",@click="createModel.show('save')") 新增
    el-table(style="width:100%;margin-top:10px",:height="400",:data="tableData",border)
      el-table-column(prop="id",label="id")
      el-table-column(prop="username",label="用户名")
      el-table-column(prop="password",label="密码")
      el-table-column(prop="type",label="类型")
        template(scope="scope")
          span(v-if="scope.row.type === 1") 管理员
          span(v-if="scope.row.type === 2") 用户
      el-table-column(label="操作")
        template(scope="scope")
          el-button(size="mini",type="primary",@click="createModel.showWithFetch(scope.row, 'update')") 修改
          el-button(size="mini",type="danger",@click="deleteModel.submit(scope.row)") 删除
    model-dialog(:model="createModel",:title="title")
      div(style="width:500px")
        el-form(
          label-width="80px",
          :rules="rules",
          :model="createFormData",
          ref="createFormRef")
          el-form-item(label="用户",prop="username")
            el-input(v-model="createFormData.username")
          el-form-item(label="密码",prop="password")
            el-input(v-model="createFormData.password")
          el-form-item(label="类型",prop="type")
            el-select(v-model="createFormData.type")
              el-option(label="管理员",:value="1")
              el-option(label="用户",:value="2")
</template>

<script>
import {BaseModel} from '../src/index'
import _ from 'lodash'
export default {
  data () {
    return {
      tableData: [
        {id: 1, username: 'test1', password: '123456', type: 1}
      ],
      rules: {
        username: [
          {required: true, message: '用户名不能为空'},
          {min: 3, max: 10, message: '用户名长度在3-10个长度之内'}
        ],
        password: [
          {required: true, message: '密码不能为空'},
          {min: 6, message: '密码不能少于6位'}
        ],
        type: [
          {required: true, message: '类型不能为空'}
        ]
      },
      createFormData: {
        username: '',
        password: '',
        type: ''
      },
      createModel: null,
      deleteModel: null,
      checkModel: null
    }
  },
  computed: {
    title () {
      if (this.createModel.openParams === 'update') {
        return '修改数据'
      } else if (this.createModel.openParams === 'save') {
        return '添加数据'
      }
    }
  },
  mounted () {

  },
  methods: {
    initModel () {
      this.initCteateModel()
      this.initDeleteModel()
    },
    initDeleteModel () {
      this.deleteModel = new BaseModel(this)
      this.deleteModel.beforeSubmit = () => {
        return this.$confirm(
          `是否删除用户名为${this.deleteModel.submitParams.username}的记录`,
          '提示', {type: 'warning'})
      }
      this.deleteModel.getRequestApi = () => {
        return this.mockDeleteServerApi
      }
      this.deleteModel.getRequestParams = () => {
        return {id: this.deleteModel.submitParams.id}
      }
    },
    initCteateModel () {
      this.createModel = new BaseModel(this, this.createFormData, 'createFormRef')
      this.createModel.getRequestApi = () => {
        if (this.createModel.openParams === 'update') {
          return this.mockUpdateServerApi
        } else {
          return this.mockCreateServerApi
        }
      }
    },
    mockDeleteServerApi (params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let arr = JSON.parse(JSON.stringify(this.tableData))
          _.remove(arr, (it) => {
            return it.id === params.id
          })
          this.tableData = arr;
          resolve({status: 200})
        }, 500)
      })
    },
    mockUpdateServerApi (params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('模拟提交成功')
          console.log('===提交数据===')
          console.log(params)
          let findItem = _.find(this.tableData, {id: params.id})
          findItem.username = params.username
          findItem.password = params.password
          findItem.type = params.type
          resolve({status: 200})
        }, 2000)
      })
    },
    mockCreateServerApi (params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('模拟提交成功')
          console.log('===提交数据===')
          console.log(params)
          this.tableData.push({id: parseInt(Math.random() * 10000), username: params.username, password: params.password, type: params.type})
          resolve({status: 200})
        }, 2000)
      })
    }
  },
  created () {
    this.initModel()
  }
}
</script>
<style lang="less" scoped>
</style>
<style lang="less">
</style>
