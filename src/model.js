import EventDispatch from './event/eventDispatch'
import { MessageBox, Message } from 'element-ui'
import ValidateError from './error/validateError'
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
      console.warn(e)
      this.emitEvent('fetch.error', e)
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
      await this.beforeSubmit()
      await this.validate()
      await this.customValidate()
      this.emitEvent('validate.success')
      this.emitEvent('request.begen')
      let res = await this.request()
      if (process.env.NODE_ENV !== 'production') {
        if (!res) {
          console.warn('request在await之后未return')
        }
      }
      if (res && res.status && res.status !== 200) {
        this.emitEvent('request.fail')
        console.warn('请求失败')
        throw new Error('request.fail')
      } else {
        this.ctx.$emit('request.success', this.submitParams, this.openParams)
        this.emitEvent('request.success')
      }
    } catch (e) {
      if (e.type === 'validateError') {
        this.emitEvent('validate.fail')
        if (e.alert) {
          MessageBox.alert(e.message, '提示', {type: 'error'})
        }
      }
      if (process.env.NODE_ENV !== 'production') {
        if (e === 'cancel') {
          return
        }
        console.warn(e)
      }
    } finally {
      this.emitEvent('submit.done')
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
          reject(new ValidateError('验证错误', false))
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
