<template>
  <div v-show="currentValue" :class="b()">
    <div :class="b('mask')" />
    <div :class="b('tip')">
      <div :class="b('arrow')" />
      <div :class="b('guide')">
        <slot />
      </div>
      <div :class="b('close')" @click="currentValue = false" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "ai-tip-share",
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) value: boolean;

  currentValue = false;

  @Watch("value")
  onValueChanged() {
    return (this.currentValue = this.value);
  }

  @Watch("currentValue")
  onCurrentValueChanged() {
    this.$emit(this.currentValue ? "on-show" : "on-hide");
    this.$emit("input", this.currentValue);
    return;
  }
}
</script>

<style lang="scss" scoped>
.ai-tip-share {
  &__mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    outline: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9;
  }

  &__tip {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    color: white;
  }

  &__arrow {
    background: url("~@/asset/image/wx-share-arrow.png") no-repeat;
    background-size: contain;
    background-position: right;
    margin-right: 15px;
    height: 125.5px;

    @media (-webkit-min-device-pixel-ratio: 2) {
      background-image: url("~@/asset/image/wx-share-arrow@2x.png");
    }

    @media (-webkit-min-device-pixel-ratio: 3) {
      background-image: url("~@/asset/image/wx-share-arrow@3x.png");
    }
  }

  &__guide {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 23px;
    font-weight: 900;
  }

  &__close {
    background: url("~@/asset/image/wx-share-btn.png") no-repeat;
    background-size: contain;
    height: 47.5px;
    background-position: center;
    margin-top: 50%;

    @media (-webkit-min-device-pixel-ratio: 2) {
      background-image: url("~@/asset/image/wx-share-btn@2x.png");
    }

    @media (-webkit-min-device-pixel-ratio: 3) {
      background-image: url("~@/asset/image/wx-share-btn@3x.png");
    }
  }
}
</style>
