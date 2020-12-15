<template>
  <div :class="'btn-area ' + (className || '') + ' ' + (size || '') + ' ' + (position || '')">
    <div
      :class="'ai-btn ' + item.type"
      v-for="(item, index) in buttons"
      :key="index"
      :style="'width:'+ item.width/10 +'rem'"
    >
      <span
        v-if="item.icon"
        :class="'iconfont ' + item.icon"
      ></span> {{item.text}}
    </div>
  </div>
</template>
<script>
import Logo from "~/components/Logo.vue";

export default {
  props: [
    "cancelText",
    "confirmText",
    "buttons",
    "className",
    "size",
    "position"
  ],
  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss" scoped>
.btn-area {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  padding: 6rem 0 2.4rem;
  background-color: #ffffff;

  .slot {
    position: absolute;
    top: 3.2rem;
    left: 0;
    width: 100%;
  }

  &.transparent {
    background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
    );
  }

  &.grey {
    padding: 2.6rem 0 2.4rem;
    background-color: #f8f8f8;
  }

  .ai-btn {
    margin: 0 .8rem;
    border-radius: 2.4rem;
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 4.8rem;
    text-align: center;
    letter-spacing: .2rem;

    .iconfont {
      font-size: 1.6rem;
    }

    &.w-126 {
      width: 12.6rem;
    }

    &.w-160 {
      width: 16rem;
    }

    &.cancel {
      background-color: #efefef;
      color: #9b9b9b;
    }

    &.primary {
      background-color: #fa8e45;
      color: #ffffff;
    }
  }

  &.mini {
    padding: 1.4rem 0;
    .ai-btn {
      line-height: 4.4rem;
    }
  }

  &.static {
    position: static;
  }
}

</style>
