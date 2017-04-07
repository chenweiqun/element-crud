class validateError extends Error {
  constructor (message, alert = true) {
    super(message)
    this.message = message || '验证错误'
    this.type = 'validateError'
    this.alert = alert
  }
}
export default validateError
