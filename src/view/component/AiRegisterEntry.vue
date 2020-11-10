<template>
  <ai-cell class="wrapper register-entry" v-if="seconds > 0">
    <template v-slot:cover>
      <img :src="require('@/asset/logo.bg.png')" class="cover" />
    </template>
    <template v-slot:title>
      <div class="title">您也可以<span>免费开通</span></div>
    </template>
    <template v-slot:subtitle>
      <div class="sub-title">
        {{ subTitle }}
      </div>
    </template>
    <template v-slot:right>
      <hui-button type="primary" @click.native="gotoRegister"
        >马上创建</hui-button
      >
    </template>
  </ai-cell>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: String, default: "学校门户/教务管理/活动招生" })
  subTitle: string;

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

  gotoRegister() {
    const merchantId = parseInt(this.$route.params.merchantId as any);
    const query = merge(this.query || {}, {
      source_id: merchantId || 0,
      source_class: merchantId ? "Merchant" : undefined,
    });
    return this.$router.push({
      name: "Register",
      query: query,
    });
  }
}
</script>
<style lang="scss" scoped>
.register-entry {
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
