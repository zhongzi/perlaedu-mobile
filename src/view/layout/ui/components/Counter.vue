<template>
  <div class="counter">
    <div class="trigger minus">-</div>
    <div class="number">{{value}}</div>
    <div class="trigger plus">+</div>
  </div>
</template>
<script>

export default {
  props: ['value'],
  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss" scoped>
.counter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 10.2rem;
  padding: .3rem;
  border-radius: .8rem;
  background-color: #f4f4f4;

  .trigger {
    flex: 0 0 2.5rem;
    border-radius: .8rem;
    background-color: #ffffff;
    font-size: 1.6rem;
    font-weight: bold;
    line-height: 2.5rem;
    text-align: center;

    &.minus {
      color: #aeaeae;
    }

    &.plus {
      color: #f5a623;
    }
  }

  .number {
    color: #4a4a4a;
    font-size: 1.4rem;
    font-weight: bold;
  }
}

</style>
