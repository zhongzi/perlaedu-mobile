<template>
  <hui-dialog v-model="innerShow">
    <div :class="b()">
      <gps-picker
        :class="b('map')"
        :value="gps"
        :address="address"
        v-if="innerShow"
      />
      <div :class="b('info')">
        <div :class="b('info-title')" v-if="title">{{ title }}</div>
        <div :class="b('info-address')" v-if="address">
          <i class="iconfont icon-location" />
          {{ address }}
        </div>
        <div :class="b('info-phone')" v-if="phone" @click="$tools.call(phone)">
          <i class="iconfont icon-call" />
          {{ phone }}
        </div>
      </div>
    </div>
  </hui-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import GpsPicker from "./AiLocationPicker/GPSPicker.vue";

import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";

@Component({
  name: "ai-location",
  components: {
    GpsPicker,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: () => [0, 0] }) gps: any;
  @Prop({ type: String, default: null }) address: string;
  @Prop({ type: String, default: null }) title: string;
  @Prop({ type: String, default: null }) phone: string;
  @Prop({ type: Boolean, default: false }) show: boolean;

  innerShow: boolean = false;

  created() {
    this.openMap();
  }

  @Watch("show")
  onShowChanged() {
    this.openMap();
  }

  @Watch("innerShow")
  onInnerShowChanged() {
    this.$emit("update:show", this.innerShow);
  }

  openMap() {
    if (this.$weixin.isInWeixin()) {
      this.show &&
        this.$weixin.config(() => {
          this.$weixin.jsapi.openLocation({
            latitude: parseFloat(this.gps[0]),
            longitude: parseFloat(this.gps[1]),
            name: this.title,
            address: this.address,
          });
        });
      this.$emit("update:show", false);
    } else {
      this.innerShow = this.show;
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-location {
  &__map {
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
  }
  &__info {
    padding: 20px;

    &-title {
      font-size: 18px;
      color: #4a4a4a;
      font-weight: 600;
      letter-spacing: 0;
      text-align: justify;
    }

    &-address,
    &-phone {
      display: flex;
      align-items: baseline;
      font-size: 13px;
      color: #6b6969;
      letter-spacing: 0;
      width: 70%;

      i {
        margin-right: 5px;
      }
    }
  }
}
</style>
