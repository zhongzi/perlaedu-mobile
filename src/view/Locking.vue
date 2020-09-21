<template>
  <div class="wrapper locking">
    <img src="~@/asset/image/locking.png" />
    <div class="desc">
      <p>抱歉, 操作失败</p>
      <p>您当前身份不是校长或者教务</p>
    </div>
    <ai-copyright :manual="true" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiCopyright from "@/view/component/AiCopyright.vue";

@Component({
  components: {
    AiCopyright,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.locking {
  width: 100%;
  height: 100vh;
  background: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  .desc {
    text-align: center;
    p:nth-child(1) {
      font-size: 32px;
      font-weight: 600;
    }
  }
}
</style>
