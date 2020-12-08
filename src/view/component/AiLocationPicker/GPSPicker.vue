<template>
  <div :class="b()">
    <div ref="map" id="ai-gps-picker-map" :class="b('map')" />
    <hui-button
      @click.native="setupGPSOnDefault"
      type="error"
      :class="b('btn')"
    >
      <i class="iconfont icon-location" />
      当前位置
    </hui-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import _get from "lodash/get";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";

@Component({
  name: "ai-gps-picker",
})
export default class Home extends Vue {
  @Prop({ type: Array, default: () => [0, 0] }) value: any;
  @Prop({ type: String, default: "" }) address: string;
  @Prop({ type: Boolean, default: false }) enableAutoGPS: string;

  qq: any = null;
  map: any = null;
  multiMarker: any = null;

  centerGPS: any = null;

  mounted() {
    this.initMap();
  }

  @Watch("address")
  onAddressChanged(oldVal, newVal) {
    this.setupGPSOnAddress();
  }

  initMap() {
    // this.$qqMap
    //   .loadScripts()
    //   .then((qq) => {
    //     this.qq = qq;
    //     this._initMap();
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });

    this.qq = window.TMap;
    this._initMap();
  }

  _initMap() {
    this.map = this.$qqMap.getMap("ai-gps-picker-map");

    this.multiMarker = new this.qq.MultiMarker({
      map: this.map,
    });

    this.map.on("dragend", this.setupGPSOnDragend);
    this.initCenterGPS();
  }

  initCenterGPS() {
    if (!isEmpty(this.value) && !isEqual(this.value, [0, 0])) {
      this.setupCenterGPS(this.value[0], this.value[1]);
      return;
    }

    if (!isEmpty(this.address)) {
      this.setupGPSOnAddress();
    } else {
      this.setupGPSOnDefault();
    }
  }

  setupGPSOnAddress() {
    this.$qqMap.addr2gps({
      address: this.address,
      callback: (res) => {
        this.setupCenterGPS(
          _get(res, "result.location.lat"),
          _get(res, "result.location.lng")
        );
      },
    });
  }

  setupGPSOnDefault() {
    if (!this.enableAutoGPS) {
      return;
    }

    this.$qqMap.getCurLocation({
      callback: (location) => {
        this.setupCenterGPS(location.lat, location.lng);
        this.$emit("position", location);
      },
    });
  }

  setupGPSOnDragend() {
    let center = this.map.getCenter();
    this.setupCenterGPS(center.getLat(), center.getLng());
  }

  setupCenterGPS(lat, lng) {
    this.centerGPS = [lat, lng];
  }

  @Watch("centerGPS")
  onCenterGPSChanged() {
    this.updateCenterMarker();
  }

  updateCenterMarker() {
    if (!this.map || !this.centerGPS) return;

    const centerGPS = new this.qq.LatLng(this.centerGPS[0], this.centerGPS[1]);
    this.map.setCenter(centerGPS);
    this.multiMarker.setGeometries([
      {
        id: "center",
        position: centerGPS,
      },
    ]);

    this.$emit("input", this.centerGPS);
  }
}
</script>
<style lang="scss" scoped>
.ai-gps-picker {
  position: relative;
  height: 100%;
  &__map {
    height: 100%;
  }
  &__btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1001;
  }
}
</style>
