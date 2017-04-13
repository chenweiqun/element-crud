import EventDispatch from './event/eventDispatch'
import { MessageBox, Message } from 'element-ui'
import _ from 'lodash'
import Vue from 'vue'
class BaseModel extends EventDispatch {
  constructor (ctx, formData, formName) {
    super()
    this.init(ctx, formData, formName)
  }
  init (ctx, formData, formName) {
    if (!ctx) {
      console.error('ctx参数不能为空');
      return
    }
    this.formName = formName
    this.submitParams = null
    this.openParams = null
    this.ctx = null
    this.ui_show = false
    this.ui_loading = false
    this.rawData = null
    this.formData = formData
    this.setContext(ctx)
    this.registerEvent()
  }
  registerEvent () {
    this.on('request.begen', () => {
      this.lock()
    })
    this.on('request.success', () => {
      this.successMessage()
      this.hide()
    })
    this.on('request.fail', () => {
      this.unlock()
    })
  }
  setContext (ctx) {
    this.ctx = ctx
  }
  emitEvent (name, ...args) {
    this.emit(name, ...args)
  }

  async fetch () {
    this.emitEvent('fetch.begen')
    try {
      await this.setFormData()
      this.emitEvent('fetch.success')
    } catch (e) {
      this.emitEvent('fetch.error', e)
      BaseModel.print('fetch方法')
    } finally {
      this.emitEvent('fetch.done')
    }
  }

  async setFormData () {
    if (this.formData) {
      _.each(this.rawData, (value, key) => {
        this.formData[key] = value
      })
    }
  }

  async submit (submitParams) {
    this.submitParams = submitParams
    try {
      try {
        await this.beforeSubmit()
      } catch (e) {
        if (e !== 'cancel') {
          BaseModel.print('beforeSubmit方法')
        }
        throw e
      }
      try {
        await this.validate()
      } catch (e) {
        BaseModel.print('validate方法', 'warn')
        this.emitEvent('validate.fail')
        throw e
      }
      try {
        await this.customValidate()
      } catch (e) {
        BaseModel.print('customValidate方法', 'warn')
        if (e.message) {
          MessageBox.alert(e.message, '提示', {type: 'error'})
        }
        throw e
      }
      this.emitEvent('validate.success')
      try {
        this.emitEvent('request.begen')
        const res = await this.request()
        this.ctx.$emit('request.success', this.submitParams, this.openParams)
        this.emitEvent('request.success', res)
      } catch (e) {
        this.emitEvent('request.fail')
        BaseModel.print('request请求失败')
        throw e
      } finally {
        this.emitEvent('request.done')
      }
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(e)
      }
    } finally {
      this.emitEvent('submit.done')
    }
  }
  static print (method, type = 'warn') {
    if (process.env.NODE_ENV !== 'production') {
      console[type](`${method} 抛出错误`)
    }
  }
  beforeSubmit () {
  }
  validate () {
    let self = this
    return new Promise(function (resolve, reject) {
      let formRef = self.ctx.$refs[self.formName]
      if (_.isNil(formRef) || !formRef.rules) {
        resolve(true)
        return
      }
      formRef.validate(function (valid) {
        if (valid) {
          resolve(true)
        } else {
          reject(new Error())
        }
      })
    })
  }
  customValidate () {
    return Promise.resolve(true)
  }
  async request () {
    let requestApi = this.getRequestApi()
    let requestParams = this.getRequestParams()
    return await requestApi(requestParams)
  }
  getRequestApi () {
  }
  getRequestParams () {
    return this.formData
  }
  successMessage () {
    Message.success({message: '操作成功'})
  }
  show (openParams) {
    this.openParams = openParams
    this.ui_show = true
  }
  isShow () {
    return this.ui_show
  }
  hide () {
    this.openParams = null
    this.submitParams = null
    this.rawData = null
    this.unlock()
    this.emitEvent('ui.hide')
    this.resetField()
    this.ui_show = false
  }
  resetField () {
    let formRef = this.ctx.$refs[this.formName]
    if (formRef) {
      formRef.resetFields()
    }
  }
  showWithFetch (rawData, openParams) {
    this.rawData = rawData
    this.show(openParams)
    Vue.nextTick(() => {
      this.fetch()
    })
  }
  lock () {
    this.ui_loading = true
  }
  unlock () {
    this.ui_loading = false
  }
  isLock () {
    return this.ui_loading
  }
}

export {BaseModel}
