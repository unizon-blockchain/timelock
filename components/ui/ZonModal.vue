<template>
  <a-modal
    :visible="visible"
    :closable="false"
    :destroy-on-close="true"
    :footer="null"
    :keyboard="false"
    :mask-closable="false"
    :width="width"
    dialogClass="c-modal__class"
    class="c-modal"
  >
    <img
      src="~/assets/img/common/close.png"
      alt="close"
      class="c-modal__close"
      @click="handleClose"
      v-if="showClose"
    />
    <div class="modal-title" v-if="title">{{ title }}</div>
    <div class="modal-body">
      <slot></slot>
    </div>
    <div class="modal-footer" v-if="footer">
      <div class="modal-footer__btn--cancel" @click="handleClose">
        {{ $t(`common['${cancelText}']`) }}
      </div>
      <g-button
        type="primary"
        class="modal-footer__btn--confirm"
        @click="handleConfirm"
        v-if="confirmText && confirmText != 'null'"
        :disabled="confirmDisabled"
        :loading="confirmLoading"
        >{{ $t(`common['${confirmText}']`) }}</g-button
      >
    </div>
    <p class="model-attach__footer" v-if="footer">
      <slot name="attach"></slot>
    </p>
  </a-modal>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'ZonModal'
})
export default class Index extends Vue {
  @Prop({ default: false, required: true }) private visible!: boolean
  @Prop({ default: '', required: false }) private title!: string
  @Prop({ default: false, required: false }) private footer!: boolean
  @Prop({ default: '30%', required: false }) private width!: string | number
  @Prop({ default: 'Cancel', required: false }) private cancelText!: string
  @Prop({ default: 'Confirm', required: false }) private confirmText!: string
  @Prop({ default: false, required: false }) private confirmDisabled!: boolean
  @Prop({ default: false, required: false }) private confirmLoading!: boolean
  @Prop({ default: true, required: false }) private showClose!: boolean

  private handleClose(): void {
    this.$emit('close')
  }

  private handleConfirm(): void {
    if (this.confirmDisabled) return
    this.$emit('confirm')
  }
}
</script>

<style lang="scss" scoped>
.c-modal {
  position: relative;
  box-sizing: border-box;

  .c-modal__close {
    position: absolute;
    top: vpx(12);
    right: vpx(12);
    width: vpx(32);
    height: vpx(32);
    cursor: pointer;
    border: 1px solid #bbb;
    border-radius: 50%;
    box-sizing: border-box;
    padding-left: 2px;
    text-align: center;
  }

  .modal-title {
    box-sizing: border-box;
    padding: vpx(16) vpx(16) 0;
    color: #000000;
    font-size: vpx(20);
    text-align: center;
    font-weight: 600;
  }

  .modal-body {
    box-sizing: border-box;
    padding: vpx(56) vpx(32) vpx(32);
  }

  .modal-footer {
    box-sizing: border-box;
    padding: 0 vpx(32) vpx(32);
    display: flex;
    justify-content: center;

    $btnWidth: 46%;
    $btnHeight: #{vpx(48)};

    .modal-footer__btn--cancel {
      width: $btnWidth;
      height: $btnHeight;
      border-radius: vpx(10);
      border: 1px solid #e1e1e1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #888888;
      cursor: pointer;
    }
    .modal-footer__btn--confirm {
      width: $btnWidth;
      height: $btnHeight;
      border-radius: vpx(10);
      border: 1px solid #eeeeee;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: vpx(48);
    }
  }

  .model-attach__footer {
    text-align: center;
    padding-bottom: vpx(24);
    font-size: vpx(14);
    font-weight: 400;
    color: #999999;
  }

  ::v-deep .ant-modal-body {
    background: #f9fafb;
    padding: 0;
    box-shadow: 0px 9px 21px 0px rgba(173, 182, 217, 0.3);
    border-radius: 10px;
  }
}
</style>