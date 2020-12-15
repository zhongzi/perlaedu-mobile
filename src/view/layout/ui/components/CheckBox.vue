<template>
  <div :class="size + ' check-box'">
    <div :class="active ? 'ico active' : 'ico'"></div> {{text}}
  </div>
</template>
<script>
export default {
  props: ["text", "active", "size"],
  head() {
    return {
      title: "AI教务"
    };
  },

  methods: {}
};
</script>
<style lang="scss" scoped>
.check-box {
  display: flex;
  align-items: center;
  color: #4a4a4a;
  font-size: 1.3rem;

  .ico {
    width: 1.7rem;
    height: 1.7rem;
    margin-right: 1rem;
    background: url('~assets/images/icon_unselect_1.png') 0 0 no-repeat;
    background-size: 100% 100%;

    &.active {
      background: url('~assets/images/icon_selected_1.png') 0 0 no-repeat;
      background-size: 100% 100%;
    }
  }

  &.big {
    .ico {
      width: 2.4rem;
      height: 2.4rem;
      background: url('~assets/images/icon_unselect.png') 0 0 no-repeat;
      background-size: 100% 100%;

      &.active {
        background: url('~assets/images/icon_selected.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}

</style>
