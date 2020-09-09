<template>
  <ai-cell class="wrapper guide-entry" v-if="seconds > 0">
    <template v-slot:cover>
      <img :src="require('@/asset/logo.bg.png')" class="cover" />
    </template>
    <template v-slot:title>
      <div class="title">您也可以<span>免费开通</span></div>
    </template>
    <template v-slot:subtitle>
      <div class="sub-title">
        这样的门户网站， 开启裂变招生
      </div>
    </template>
    <template v-slot:right>
      <hui-button type="primary" @click.native="openGuide">马上创建</hui-button>
    </template>
  </ai-cell>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  timer: any = null;
  seconds: number = 10;

  created() {
    // this.timer = setInterval(() => {
    //   this.seconds -= 1;
    //   if(this.seconds <= 0) {
    //     this.clean();
    //   }
    // }, 1000);
  }

  beforeDestory() {
    this.clean();
  }

  clean() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  openGuide() {
    const merchantId = this.$route.params.merchantId;
    return this.$router.push({
      name: "newWebsiteGuide",
      query: {
        source_id: merchantId,
        source_class: merchantId ? "Merchant" : undefined,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.guide-entry {
  padding: 10px;
  background: rgb(255, 255, 255);
  border-radius: 4px;

  .cover {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 8px;
  }
}
</style>
