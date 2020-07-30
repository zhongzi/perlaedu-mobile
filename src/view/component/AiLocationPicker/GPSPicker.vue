<template>
  <div :class="b()">
    <div ref="map" :class="b('map')" />
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

import QQMap from "./QQMap";

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
  locationFetcher: any = null;
  geocoder: any = null;
  centerMarker: any = null;

  innergps: any = null;

  created() {
    QQMap(this.$configs.qqMapKey).then((qq) => {
      this.qq = qq;

      this.map = new this.qq.maps.Map(this.$refs.map, {
        zoom: 15,
        mapTypeControl: false,
      });
      this.centerMarker = new this.qq.maps.Marker({
        map: this.map,
      });

      this.geocoder = new this.qq.maps.Geocoder({
        complete: (result) => {
          this.setupGPS(
            result.detail.location.getLat(),
            result.detail.location.getLng()
          );
        },
      });

      this.qq.maps.event.addListener(
        this.map,
        "dragend",
        this.setupGPSOnDragend
      );

      this.initGPS();
    });
  }

  @Watch("address")
  onAddressChanged(oldVal, newVal) {
    this.setupGPSOnAddress();
  }

  initGPS() {
    if (!isEmpty(this.value) && !isEqual(this.value, [0, 0])) {
      this.setupGPS(this.value[0], this.value[1]);
      return;
    }

    if (!isEmpty(this.address)) {
      this.setupGPSOnAddress();
    } else {
      this.setupGPSOnDefault();
    }
  }

  setupGPSOnAddress() {
    !isEmpty(this.address) &&
      this.geocoder &&
      this.geocoder.getLocation(this.address);
  }

  setupGPSOnDefault() {
    if (!this.enableAutoGPS) {
      return;
    }

    if (!this.locationFetcher) {
      this.locationFetcher = new this.qq.maps.Geolocation(
        this.$configs.qqMapKey,
        this.$configs.qqMapName
      );
    }

    this.$hui.loading.show("查询中...");
    if (this.locationFetcher) {
      this.locationFetcher.getLocation(
        (position) => {
          this.$hui.loading.hide();
          this.setupGPS(position.lat, position.lng);
          this.$emit("position", position);
        },
        (e) => {
          console.log(e);
          this.$hui.loading.hide();
          this.$hui.toast.error("获取当前位置失败，请稍后重试");
        },
        {
          timeout: 60000,
        }
      );
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.$hui.loading.hide();
        this.setupGPS(pos.coords.latitude, pos.coords.longitude);
      });
    }
  }

  setupGPSOnDragend() {
    let center = this.map.getCenter();
    this.setupGPS(center.getLat(), center.getLng());
  }

  setupGPS(lat, lng) {
    this.innergps = [lat, lng];
  }

  @Watch("innergps")
  onGPSChanged() {
    this.updateMap();
  }

  updateMap() {
    if (!this.map || !this.innergps) {
      return;
    }

    let innergps = new this.qq.maps.LatLng(this.innergps[0], this.innergps[1]);
    this.map.setCenter(innergps);
    this.centerMarker.setPosition(innergps);

    this.$emit("input", this.innergps);
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
  }
}
</style>
