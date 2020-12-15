<template>
  <div :class="'item ' + (type || '')">
    <div class="label">
      {{label}}
      <span
        class="star"
        v-if="required"
      >*</span>
    </div>
    <div class="cont">
      <div
        class="image"
        v-if="type === 'image'"
      ></div>

      <div
        class="video"
        v-if="type === 'video'"
      >＋</div>

      <div
        class="voice"
        v-if="type === 'voice'"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["type", "label", "required", "value"],
  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss" scoped>
.item {
  position: relative;
  padding: 1.2rem 0 0;

  .label {
    padding: .1rem 0;
    color: #4a4a4a;
    font-size: 1.4rem;
    font-weight: bold;
  }

  .cont {
    padding: .7rem 0 .3rem;

    .input {
      width: 100%;
      color: #4a4a4a;
      font-size: 1.3rem;

      &::-webkit-input-placeholder {
        color: #9b9b9b;
      }
    }

    .video {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 8.8rem;
      height: 6rem;
      border-radius: .8rem;
      background: rgba(243, 243, 243, 1);
      color: #d8d8d8;
      font-size: 2.4rem;
      font-weight: bold;
    }
  }
}

</style>
