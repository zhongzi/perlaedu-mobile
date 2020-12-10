<template>
  <div class="wrapper editing">
    <ai-image-uploader
      class="cover"
      v-model="innerMerchant.cover"
      type="merchant"
      :prefix="merchant.id"
    />
    <div class="fields">
      <ai-input class="field" label="名称" v-model="innerMerchant.title" />
      <ai-line />
      <ai-location-picker
        class="field"
        label="地址"
        :value="location"
        @input="updateLocation"
      />
      <ai-line />
      <ai-input class="field" label="联系电话" v-model="innerMerchant.tel" />
      <ai-input
        class="field"
        label="标签(逗号间隔)"
        v-model="innerMerchant.tags_info"
      />
      <ai-input-textarea
        v-model="innerMerchant.remark"
        placeholder="备注说明"
      />
      <ai-input
        class="field"
        label="关联客户ID"
        v-model.number="innerMerchant.related_merch_id"
      />
      <ai-input
        class="field"
        label="关联线索ID"
        v-model.number="innerMerchant.related_clue_id"
      />
    </div>
    <ai-fixed-footer>
      <ai-submit-actions @cancel="goBack" @submit="submit" />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiLocationPicker from "@/view/component/AiLocationPicker";
import AiLine from "@/view/component/AiLine.vue";
import AiInputTextarea from "@/view/component/AiInputTextarea.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
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
    AiInputTextarea,
    AiSubmitActions,
    AiFixedFooter,
  },
})
export default class Home extends Mixins(SyncMixin) {
  innerMerchant: any = null;

  get merchant() {
    return this.entity;
  }

  get location() {
    return {
      gps: this.innerMerchant.loc,
      location: {
        province: this.innerMerchant.ad_info.province,
        city: this.innerMerchant.ad_info.city,
        zone: this.innerMerchant.ad_info.district,
        address: this.innerMerchant.address,
      },
    };
  }

  created() {
    this.store = "mongoMerchant";
    this.load();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    if (this.$route.name === "crmMerchantEditing") {
      this.load();
    }
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    if (isEqual(this.merchant, this.innerMerchant)) return;

    this.innerMerchant = this.reverseGPS(
      cloneDeep(merge(this.innerMerchant, this.merchant))
    );
    delete this.innerMerchant._id;
    delete this.innerMerchant.data;
  }

  load() {
    this.innerMerchant = {
      id: "",
      cover: "",
      title: "",
      loc: [0, 0],
      address: "",
      ad_info: {
        province: "",
        city: "",
        district: "",
      },
      tel: "",
      tags_info: "",
      remark: "",
      related_merch_id: "",
      related_clue_id: "",
    };

    this.id = this.$route.params.merchantId;
    if (this.id === "new") {
      this.id = null;
    } else {
      this.loadEntity();
    }
  }

  reverseGPS(merchant) {
    if (!isEmpty(_get(merchant, "loc"))) {
      merchant.loc = merchant.loc.reverse();
    }
    return merchant;
  }

  submit() {
    this.id = this.innerMerchant.id;
    const res = !this.id
      ? {
          docs: this.reverseGPS(cloneDeep(this.innerMerchant)),
        }
      : {
          id: this.id,
          query: {},
          update: this.reverseGPS(cloneDeep(this.innerMerchant)),
        };

    this.saveEntity({
      res: res,
      success: () => {
        this.$hui.toast.info("保存成功");
        this.$nextTick(() => {
          this.goBack();
        });
      },
    });
  }

  goBack() {
    this.$router.go(-1);
  }

  updateLocation(location) {
    this.innerMerchant.loc = location.gps;
    this.innerMerchant.address = location.location.address;
    this.innerMerchant.ad_info = {
      province: location.location.province,
      city: location.location.city,
      district: location.location.zone,
    };
  }
}
</script>
<style lang="scss" scoped>
.editing {
  padding-bottom: 50px;

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
