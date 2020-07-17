<template>
  <div class="wrapper">
    <ai-image-uploader
      class="cover"
      v-model="innerMerchant.cover_url"
      type="merchant"
      :prefix="merchant.id"
    />
    <div class="fields">
      <ai-input class="field" label="机构名称" v-model="innerMerchant.name" />
      <ai-line />
      <ai-location-picker
        class="field"
        label="机构地址"
        :value="innerMerchant.location"
        @input="updateLocation"
      />
      <ai-line />
      <ai-input
        class="field"
        label="机构联系电话"
        v-model="innerMerchant.phone"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiLocationPicker from "@/view/component/AiLocationPicker";
import AiLine from "@/view/component/AiLine.vue";

import isEqual from "lodash/isEqual";
import _get from "lodash/get";
import merge from "lodash/merge";
import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiImageUploader,
    AiInput,
    AiLine,
    AiLocationPicker,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: () => ({}) }) merchant: any;

  innerMerchant: any = {
    id: "",
    cover_url: "",
    name: "",
    location: { address: "" },
    phone: "",
  };

  get debSave() {
    return debounce(() => {
      this.saveEntity({
        res: cloneDeep(this.innerMerchant),
      });
    }, 500);
  }

  created() {
    this.enableLoading = false;
    this.store = "merchant";
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    if (isEqual(this.merchant, this.innerMerchant)) return;

    this.innerMerchant.id = this.merchant.id;
    this.innerMerchant.cover_url = this.merchant.cover_url;
    this.innerMerchant.name = this.merchant.name;
    this.innerMerchant.location = merge(
      { address: "" },
      this.merchant.location || {}
    );
    this.innerMerchant.phone = this.merchant.phone;
  }

  @Watch("innerMerchant", { deep: true })
  onInnerMerchantChanged() {
    this.save();
  }

  save() {
    this.id = this.merchant.id;
    if (!this.id) return;

    this.debSave();
  }

  updateLocation(location) {
    this.innerMerchant.location = merge(this.innerMerchant.location, location);
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  .fields {
    position: relative;
    top: -15px;
    background: rgba(247, 247, 247, 1);
    border-radius: 12px;

    padding-top: 17px;
    padding-left: 17px;
    padding-right: 17px;
  }
}
</style>
