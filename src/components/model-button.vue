<template>
  <button :disabled="disabled"
          class="el-button"
          @click="handleClick"
          :autofocus="autofocus"
          :type="nativeType"
          :class="[
        type ? 'el-button--' + type : '',
        size ? 'el-button--' + size : '',
        {
          'is-disabled': disabled,
          'is-loading': modelLoading,
          'is-plain': plain
        }
      ]">
    <i class="el-icon-loading"
       v-if="modelLoading"></i>
    <i :class="'el-icon-' + icon"
       v-if="icon && !modelLoading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
import emitter from '../mixins/emitter'
export default {
  mixins: [emitter],
  componentName: 'Model-Button',
  name: 'Model-Button',
  data () {
    return {
      modelLoading: false
    }
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean
  },
  mounted () {
    this.$on('loading', (val) => {
      this.modelLoading = val
    })
  },
  methods: {
    handleClick (evt) {
      this.$emit('click', evt);
    }
  }
};
</script>
