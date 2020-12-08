<template>
  <div class="wrapper merchant">
    <ai-card class="body">
      <template v-slot:body>
        <img :src="cover" class="cover" />
        <ai-line />
        <div class="sections">
          <div class="section">
            <div class="item">
              <span> LBSID: </span>
              <span> {{ merchant.lbs_id }} </span>
            </div>
            <div class="item title">
              <span> 名称: </span>
              <span> {{ merchant.title }} </span>
            </div>
            <div class="item">
              <span> 地址: </span>
              <span> {{ address }} </span>
            </div>
            <div class="item">
              <span> 电话: </span>
              <div class="phone">
                <span> {{ phone }} </span>
                <i
                  v-if="phone.length > 0"
                  class="iconfont icon-phone"
                  @click="call"
                />
              </div>
            </div>
            <div class="item">
              <span> 类别: </span>
              <span> {{ merchant.category }} </span>
            </div>
            <div class="item">
              <span> 备注: </span>
              <span>{{ merchant.remark }} </span>
            </div>
          </div>
          <div class="section" v-if="zones && zones.length > 0">
            <div class="item">
              <span> 归属片区: </span>
              <div>
                <template v-for="(zone, index) in zones">
                  <span :key="index">
                    {{ zone.title }} - {{ zone.follower.nickname }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ai-card>
    <ai-fixed-footer v-if="showSubmitActions">
      <ai-submit-actions
        submitLabel="编辑"
        @cancel="goBack"
        @submit="goEditing"
      />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiLine from "@/view/component/AiLine.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import trim from "lodash/trim";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import merge from "lodash/merge";
import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";
import find from "lodash/find";
import startsWith from "lodash/startsWith";

@Component({
  components: {
    AiCard,
    AiLine,
    AiSubmitActions,
    AiFixedFooter,
  },
})
export default class Home extends Mixins(SyncMixin) {
  zones: any = [];

  get cover() {
    return (
      _get(this.merchant, "cover") ||
      require("@/asset/image/default/cover-merchant.png")
    );
  }

  get address() {
    if (isEmpty(this.merchant)) return "";

    const info = this.merchant.ad_info;
    const address = this.merchant.address;
    const prefix = `${info.province}${info.city}${info.district}`;
    return startsWith(address, prefix) ? address : `${prefix}${address}`;
  }

  get phone() {
    return trim(this.merchant.tel || "");
  }

  get merchant() {
    return this.entity;
  }

  get showSubmitActions() {
    return (
      find(
        this.zones || [],
        (zone) =>
          zone.follower && zone.follower.openid === this.$auth.user.openid
      ) || this.$auth.user.kind === 1
    );
  }

  created() {
    this.store = "mongoMerchant";
    this.load();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.load();
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.loadRelatedZones();
  }

  load() {
    this.id = this.$route.params.merchantId;
    this.loadEntity();
  }

  loadRelatedZones() {
    if (isEmpty(this.merchant.loc)) return;

    let query = {
      location: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: this.merchant.loc,
          },
        },
      },
    };
    this.loadList({
      store: "mongoMerchantZone",
      query: {
        query: JSON.stringify(query),
      },
      success: (resp) => {
        this.zones = resp.data.data;
      },
    });
  }

  goBack() {
    this.$router.go(-1);
  }

  goEditing() {
    this.$router.push({
      name: "crmMerchantEditing",
      params: {
        merchantId: this.merchant.id,
      },
    });
    return;
  }
  call() {
    this.$tools.call(this.merchant.tel);
  }
}
</script>
<style lang="scss" scoped>
.merchant {
  padding: 10px;
  .body {
    padding: 20px 10px;

    .cover {
      width: 100%;
      border-radius: 10px;
    }
    .sections {
      margin: 10px 0px;

      .section {
        .item {
          margin: 10px 0px;
          font-size: 14px;
          display: flex;
          justify-content: flex-start;

          & > span:first-child {
            text-align: right;
            min-width: 70px;
            font-size: 16px;
            font-weight: 800;
            margin-right: 10px;
          }

          .phone {
            i {
              transform: scaleX(-1);
            }
          }
        }
      }
    }
  }
}
</style>
