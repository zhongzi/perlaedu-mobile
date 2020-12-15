<template>
  <div :class="b()">
    <div :class="b('header')">
      <div :class="b('header-trinket')" />
      <slot name="header" />
    </div>
    <div :class="b('body')">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "ly-detail",
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.ly-detail {
  width: 100%;
  height: 100%;

  &__header {
    position: relative;
    overflow: hidden;

    height: 120px;
    box-sizing: content-box;
    padding: 0px 0px 20px;
    background: linear-gradient(136deg, #ffcf33 0%, #ff8306 100%);

    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30px;

    &-trinket {
      width: 170px;
      height: 220px;

      position: absolute;
      top: 40px;
      right: -100px;

      background: linear-gradient(234deg, #ffa02f 0%, #ffbd26 80%);
      border-radius: 24px;
      transform: rotate(35deg);

      opacity: 0.5;
    }
  }

  &__body {
    position: relative;
    top: -20px;
    border-radius: 20px;

    min-height: 70vh;
    background: #fff;
  }
}
</style>
