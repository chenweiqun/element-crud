<template lang="pug">
  .model-dialog
    el-dialog(
      :title="title",
      :top="top",
      :modal="modal",
      size="auto",
      :modal-append-to-body="modalAppendToBody",
      :lock-scroll="lockScroll",
      :customClass="customClass",
      :close-on-click-modal="closeOnClickModal",
      :close-on-press-escape="closeOnPressEscape",
      :show-close="showClose",
      :value="model && model.isShow()",
      @close="onClose")
        div(slot="title",v-if="!title")
          slot(name="title")
        slot(name="default",v-if="model.isShow() || keepAlive")
        div(slot="footer")
          slot(name="footer")
            model-button(type="primary",@click="model.submit()") 提交
</template>

<script>
import {Dialog} from 'element-ui'
import emitter from '../mixins/emitter'
let dialogProps = Dialog.props
export default {
  mixins: [emitter],
  props: {
    keepAlive: {
      type: Boolean,
      default: true
    },
    model: {
      type: Object,
      required: true
    },
    ...dialogProps
  },
  methods: {
    onClose () {
      this.$emit('close')
      this.model.hide()
    }
  },
  mounted () {
    this.model.on('request.begen', () => {
      this.broadcast('Model-Button', 'loading', true)
    })
    this.model.on('submit.done', () => {
      this.broadcast('Model-Button', 'loading', false)
    })
    this.model.on('ui.hide', () => {
      this.broadcast('Model-Button', 'loading', false)
    })
  },
  data () {
    return {}
  }
}
</script>

<style lang="less">

</style>
