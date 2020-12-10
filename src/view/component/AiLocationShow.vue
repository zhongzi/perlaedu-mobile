<template>
  <div :class="b()">
    <ai-popup :value="openInNoWeixin" @input="updateValue" :class="b('popup')">
      <div class="back" @click.stop="updateValue(false)">
        <i class="iconfont icon-direction-left" />
        <span> 返回 </span>
      </div>
      <iframe width="100%" height="100%" :src="url" />
    </ai-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiPopup from "./AiPopup.vue";

@Component({
  name: "ai-location-show",
  components: {
    AiPopup,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: String, default: null }) title: string;
  @Prop({ type: String, default: null }) address: string;
  @Prop({ type: Array, default: null }) gps: any;

  url: string = null;
  openInNoWeixin: boolean = false;

  @Watch("value")
  onValueChanged() {
    this.openMap();
  }

  updateValue(v) {
    this.openInNoWeixin = v;
    return this.$emit("input", v);
  }

  openMap() {
    if (!this.value) return;

    if (this.$weixin.isInWeixin()) {
      this.$weixin.config(() => {
        this.$weixin.jsapi.openLocation({
          latitude: parseFloat(this.gps[0]),
          longitude: parseFloat(this.gps[1]),
          name: this.title,
          address: this.address,
        });
      });
      return;
    }

    this.url = this.$qqMap.getLocationURL({
      title: this.title,
      address: this.address,
      coord: this.gps,
    });

    this.openInNoWeixin = true;
  }
}
</script>
<style lang="scss" scoped>
.ai-location-show {
  &__popup {
    height: 100vh;

    .back {
      position: fixed;
      top: 10px;
      left: 20px;
      background: #fff;
      padding: 10px;
      border-radius: 5px;
    }
  }
}
</style>
