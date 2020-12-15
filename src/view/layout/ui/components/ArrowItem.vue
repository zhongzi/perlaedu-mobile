<template>
  <div class="item-wrap">
    <div :class="'item ' + className">
      <div class="cont">
        <div class="label">
          {{label}}
        </div>
        <div
          class="value"
          v-if="value"
        >{{value}}</div>
      </div>

      <div
        class="avatar"
        v-if="type === 'avatar'"
      ></div>
      <div
        class="radio-btn"
        v-else-if="type === 'radio'"
      ></div>
      <div v-else>
        <div class="arrow"></div>
      </div>
    </div>
    <div :class="'slot ' + className">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: ["type", "label", "value", "className"],
  head() {
    return {
      title: "AI教务"
    };
  },

  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 0;
  border-bottom: .1rem solid rgba(151, 151, 151, .1);

  .label {
    color: #4a4a4a;
    font-size: 1.4rem;
    font-weight: bold;
  }

  .value {
    color: #9b9b9b;
    font-size: 1.3rem;
  }

  .avatar {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 1rem;
    background-color: #ffd811;
  }

  .arrow {
    width: .9rem;
    height: 1.4rem;
    background: url('~assets/images/icon_arrow_right.png') 0 0 no-repeat;
    background-size: 100%;

    &.active {
      transform: rotate(-90deg);
    }
  }

  .radio-btn {
    width: 4.8rem;
    height: 2.6rem;
    background: url('~assets/images/icon_radio.png') 0 0 no-repeat;
    background-size: 100% 100%;
  }

  &.active {
    .radio-btn {
      background: url('~assets/images/icon_radio_active.png') 0 0 no-repeat;
      background-size: 100% 100%;
    }

    .arrow {
      transform: rotate(-90deg);
    }
  }

  &.margin {
    margin: 0 2.8rem;
  }
}

.slot {
  background: linear-gradient(
  180deg,
  rgba(251, 251, 251, 1) 0%,
  rgba(246, 246, 246, 1) 100%
  );

  &.margin {
    padding: 0 2.8rem;
  }
}

</style>
