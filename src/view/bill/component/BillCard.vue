<template>
  <div :class="[{ 'bill-card-selected': isSelected }, 'bill-card']">
    <img class="bill-card__decorator-logo" :src="require('@/asset/logo.png')" />
    <div class="bill-card__header">
      <slot name="header"> </slot>
    </div>
    <div class="bill-card__content">
      <slot name="left">
        <div class="bill-card__content-left">
          <div class="bill-card__content-left-title">
            <slot name="left-title" />
          </div>
          <div class="bill-card__content-left-remark">
            <slot name="left-remark" />
          </div>
        </div>
      </slot>
      <slot name="right" v-if="enableRight">
        <div class="bill-card__content-right">
          <div class="bill-card__content-right-title">
            <slot name="right-title" />
          </div>
          <div class="bill-card__content-right-remark">
            <slot name="right-remark" />
          </div>
        </div>
      </slot>
    </div>
    <div class="bill-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) isSelected: boolean;
  @Prop({ type: Boolean, default: true }) enableRight: boolean;
}
</script>
<style lang="scss" scoped>
.bill-card {
  position: relative;
  min-width: 300px;
  min-height: 95px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  overflow: hidden;

  &__decorator-logo {
    position: absolute;
    left: -30px;
    bottom: 0px;

    width: 70px;
    transform: rotate(45deg);

    opacity: 0.1;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 20px;

    height: 100%;

    &-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-group: 1;

      height: 100%;

      &-title {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
        line-height: 1.2;
      }
      &-remark {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(155, 155, 155, 1);
        line-height: 1.2;
      }
    }

    &-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      flex-wrap: nowrap;

      height: 100%;
      min-width: 100px;

      &-title {
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 117, 6, 1);
        line-height: 1.2;
      }

      &-remark {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(155, 155, 155, 1);
        line-height: 1.2;
      }
    }
  }
}
</style>
