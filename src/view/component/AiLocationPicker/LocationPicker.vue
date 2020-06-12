<template>
  <div :class="b()">
    <ai-cell
      :class="b('cell')"
      :title="label"
      :subtitle="value.address"
      @click.native="showPicker = true"
    >
      <template v-slot:right>
        <i class="iconfont icon-direction" />
      </template>
    </ai-cell>
    <hui-popup v-model="showPicker" position="right">
      <div :class="b('popup')">
        <gps-picker
          :class="b('map')"
          :value="innerValue.gps"
          :address="innerValue.address"
          :enableAutoGPS="true"
          @input="updateGPS"
          @position="updateCurAddress"
        />
        <address-picker
          :class="b('address')"
          :value="innerValue.location"
          @input="updateAddress"
        />
        <ai-submit-actions @submit="onSubmit" @cancel="showPicker = false" />
      </div>
    </hui-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiCell from "../AiCell.vue";
import AiSubmitActions from "../AiSubmitActions.vue";

import GpsPicker from "./GPSPicker.vue";
import AddressPicker from "./AddressPicker.vue";

import merge from "lodash/merge";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";

@Component({
  name: "ai-location-picker",
  components: {
    AiCell,
    AiSubmitActions,
    GpsPicker,
    AddressPicker,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: Object, default: () => {} }) value: any;

  showPicker: boolean = false;
  innerValue: any = { address: "" };

  created() {
    this.innerValue = cloneDeep(this.value);
  }

  @Watch("value", { deep: true })
  onValueChanged() {
    if (isEqual(this.innerValue, this.value)) return;

    this.innerValue = cloneDeep(this.value);
  }

  updateGPS(gps) {
    this.innerValue = merge(this.innerValue, { gps: gps });
  }

  updateCurAddress(position) {
    if (!isEmpty(this.innerValue.location)) return;
    this.innerValue = merge(this.innerValue, {
      location: {
        province: position.province,
        city: position.city,
        zone: position.district,
        address: position.addr,
      },
    });
  }

  updateAddress(location) {
    this.innerValue = merge(this.innerValue, {
      location: location,
      address: `${location.province || ""}${location.city || ""}${
        location.zone || ""
      }${location.address || ""}`,
    });
  }

  onSubmit() {
    this.$emit("input", this.innerValue);
    this.showPicker = false;
  }
}
</script>
<style lang="scss" scoped>
.ai-location-picker {
  &__popup {
    height: 100vh;
  }

  &__map {
    height: 60%;
  }

  &__address {
    height: 15%;
    margin: 20px 10px;
  }
}
</style>
