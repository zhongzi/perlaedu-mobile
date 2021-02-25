<template>
  <div class="wrapper media-merchant">
    <framework>
      <template v-slot:switch>
        <ai-button-round @click.native="gotoEditing" class="upload">
          <i class="iconfont icon-upload" />
          <span>上传作品</span>
        </ai-button-round>
      </template>
      <template v-slot:body>
        <capacity-limit :merchant="merchant" />
        <album-list class="section" :merchantId="merchantId" />
        <album-list-student class="section" :merchantId="merchantId" />
        <album-list-group class="section" :merchantId="merchantId" />
        <album-list-teacher class="section" :merchantId="merchantId" />
        <album-list-course class="section" :merchantId="merchantId" />
      </template>
    </framework>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButtonRound from "@/view/component/AiButtonRound.vue";
import AiButtonRoundSmall from "@/view/component/AiButtonRoundSmall.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import AlbumList from "./component/AlbumList.vue";
import AlbumListStudent from "./component/AlbumListStudent.vue";
import AlbumListGroup from "./component/AlbumListGroup.vue";
import AlbumListTeacher from "./component/AlbumListTeacher.vue";
import AlbumListCourse from "./component/AlbumListCourse.vue";
import CapacityLimit from "./component/CapacityLimit.vue";

import Framework from "@/view/merchant/component/Framework.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiButtonRound,
    AiButtonRoundSmall,
    AiFixedFooter,
    AlbumList,
    AlbumListCourse,
    AlbumListStudent,
    AlbumListGroup,
    AlbumListTeacher,
    Framework,
    CapacityLimit,
  },
})
export default class Home extends Mixins(SyncMixin) {
  merchantId: string = null;

  get merchant() {
    return this.entity;
  }

  created() {
    this.store = "merchant";
    this.resetMerchantId();
    this.$bus.$on("merchant:switched", (merchant) => {
      this.resetMerchantId(merchant.id);
    });
  }

  activated() {
    this.resetMerchantId();
  }

  resetMerchantId(merchantId = null) {
    this.merchantId =
      merchantId ||
      this.$route.query._merchant_id_ ||
      this.$auth.user.curr_merch_id;
    this.loadMerchant();
  }

  loadMerchant() {
    if (!this.merchantId) return;

    this.id = this.merchantId;
    this.loadEntity({
      query: {
        extras: "media_capactiy_limit",
      },
    });
  }

  gotoEditing() {
    this.$router.push({
      name: "mediaPhotoEditing",
      params: {
        mediaId: "new",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.media-merchant {
  .upload {
    width: 100px;
    color: #e2630e;
    border: none;
    min-height: auto;
    padding: 10px 0px;
    margin-left: 10px;
  }
  .section {
    margin: 5px auto 15px;

    & ::v-deep .ai-card__footer {
      text-align: center;
      font-size: 12px;
      color: #747474;
    }
  }
}
</style>
