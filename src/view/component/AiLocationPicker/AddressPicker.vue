<template>
  <div :class="b()">
    <div :class="b('selections')">
      <ai-selection
        :class="b('selection')"
        label="省份/直辖市"
        v-model="province"
        :options="provinces"
      />
      <ai-selection
        :class="b('selection')"
        label="城市"
        v-model="city"
        :options="cities"
      />
      <ai-selection
        :class="b('selection')"
        label="区域"
        v-model="zone"
        :options="zones"
      />
    </div>
    <ai-input :class="b('address')" v-model="address" placeholder="详细地址" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiSelection from "@/view/component/AiSelection.vue";
import AiInput from "@/view/component/AiInput.vue";

const locationData = require("@/asset/data/location.json");

import isEmpty from "lodash/isEmpty";

@Component({
  name: "ai-address-picker",
  components: {
    AiSelection,
    AiInput,
  },
})
export default class Home extends Vue {
  @Prop(Object) value: any;

  province: string = null;
  city: string = null;
  zone: string = null;
  address: string = null;

  created() {
    this.reset();
  }

  reset() {
    if (isEmpty(this.value)) return;

    this.province = this.value.province;
    this.city = this.value.city;
    this.zone = this.value.zone;
    this.address = this.value.address;
  }

  @Watch("value")
  onLocationChanged() {
    this.reset();
  }

  get provinces() {
    return Object.keys(locationData);
  }

  get cities() {
    if (isEmpty(this.province)) {
      return [];
    }
    return Object.keys(locationData[this.province]);
  }

  get zones() {
    if (isEmpty(this.city)) {
      return [];
    }
    return locationData[this.province][this.city] || [];
  }

  @Watch("province")
  onProvinceChanged(newV, oldV) {
    if (isEmpty(oldV)) return;

    if (this.cities.indexOf(this.city) < 0) {
      this.city = "";
      this.zone = "";
    }
    this.emitChanged();
  }

  @Watch("city")
  onCityChanged(newV, oldV) {
    if (isEmpty(oldV)) return;

    if (this.zones.indexOf(this.zone) < 0) {
      this.zone = "";
    }
    this.emitChanged();
  }

  @Watch("zone")
  onZoneChanged(newV, oldV) {
    if (isEmpty(oldV)) return;

    this.emitChanged();
  }

  @Watch("address")
  onAddressChanged(newV, oldV) {
    this.emitChanged();
  }

  emitChanged() {
    this.$emit("input", {
      province: this.province,
      city: this.city,
      zone: this.zone,
      address: this.address,
    });
  }
}
</script>
<style lang="scss" scoped>
.ai-address-picker {
  width: 100%;
  height: 100%;

  &__selections {
    display: flex;
    justify-content: space-between;
  }

  &__selection {
    width: 30%;
  }

  &__address {
    width: 100%;
  }
}
</style>
