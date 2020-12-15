<template>
  <div class="user-item">
    <div class="detail">
      <!-- <image
        class="avatar"
        src=""
      /> -->
      <div class="avatar"></div>
      <div class="info">
        <div class="name">
          张翠山
        </div>
        <div class="status">
          九阴白骨爪
        </div>
      </div>
    </div>
    <div class="edit"></div>
  </div>
</template>
<script>
import Counter from "~/components/Counter.vue";
export default {
  components: {
    /** 计数器 */
    counter: Counter
  }
};
</script>
<style lang="scss" scoped>
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 13.5rem;
  height: 3rem;

  .detail {
    display: flex;
    flex: 1;
    align-items: center;

    .avatar {
      display: block;
      flex: 0 0 2.8rem;
      height: 2.8rem;
      border-radius: .8rem;
      background-color: #ffd811;
    }

    .info {
      flex: 1;
      padding-left: .5rem;
      color: #4a4a4a;
      font-size: 1rem;
      font-weight: bold;
      line-height: 1.3;
    }
  }

  .edit {
    flex: 0 0 1.6rem;
    height: 1.5rem;
    background: url(~assets/images/icon_edit_1.png) 0 0 no-repeat;
    background-size: 100% 100%;
  }
}

</style>
