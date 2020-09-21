<template>
  <div class="wrapper floor-more">
    <floor title="更多功能">
      <div class="main">
        <img :src="require('@/asset/mp.ai.more.qrcode.jpeg')" />
        <p>长按识别二维码, 进入更多功能</p>
      </div>
    </floor>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import Floor from "./Floor.vue";

@Component({
  components: {
    Floor,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;
}
</script>
<style lang="scss" scoped>
.floor-more {
  .main {
    text-align: center;

    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4a4a4a;
    line-height: 18px;

    img {
      width: 100px;
    }
  }
}
</style>
