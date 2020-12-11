<template>
  <div class="wrapper merchant">
    <div class="status" v-if="merchant.notExisted">
      <img :src="statusImg" />
    </div>
    <ai-card class="body">
      <template v-slot:body>
        <img :src="cover" class="cover" />
        <div class="sections">
          <div class="section">
            <div class="item">
              <span> LBSID: </span>
              <span> {{ merchant.lbs_id }} </span>
            </div>
            <div class="item">
              <span> 收录版本: </span>
              <span> {{ merchant.version }} </span>
            </div>
            <div class="item title">
              <span> 名称: </span>
              <span> {{ merchant.title }} </span>
            </div>
            <div class="item">
              <span> 地址: </span>
              <span @click="show = true"> {{ address }} </span>
            </div>
            <div class="item">
              <span> 电话: </span>
              <span @click="call"> {{ phone }} </span>
            </div>
            <div class="item">
              <span> 类别: </span>
              <span> {{ merchant.category }} </span>
            </div>
            <div class="item" v-if="merchant.tags_info">
              <span> 标签: </span>
              <span> {{ merchant.tags_info }} </span>
            </div>
            <div class="item">
              <span> 备注: </span>
              <span>{{ merchant.remark }} </span>
            </div>
          </div>
          <template v-if="zones && zones.length > 0">
            <ai-line />
            <div class="section">
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
          </template>
          <template>
            <ai-line />
            <div class="section">
              <div class="navs">
                <div class="nav" @click="show = true">
                  <i class="iconfont icon-location-empty" />
                </div>
                <div class="nav" v-if="phone.length > 0" @click="call">
                  <i class="iconfont icon-phone" />
                </div>
                <div class="nav" v-if="showHome" @click="goWebsite">
                  <i class="iconfont icon-home" />
                </div>
                <div class="nav" v-if="showClue" @click="goClue">
                  <i class="iconfont icon-clue i-clue" />
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </ai-card>
    <ai-fixed-footer>
      <ai-submit-actions
        cancelLabel="返回地图"
        :submitLabel="showSubmitActions ? '编辑' : ''"
        :deleteLabel="showSubmitActions ? '转线索' : ''"
        @cancel="goBack"
        @submit="goEditing"
        @deleted="beRelatedClue"
      />
    </ai-fixed-footer>
    <clue-remark :merchant="merchant" v-model="showClueRemark" />
    <ai-location-show
      v-if="merchant.loc"
      v-model="show"
      :title="merchant.title"
      :address="address"
      :gps="[merchant.loc[1], merchant.loc[0]]"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiLine from "@/view/component/AiLine.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiLocationShow from "@/view/component/AiLocationShow.vue";
import AiInputSwitch from "@/view/component/AiInputSwitch.vue";

import ClueRemark from "./component/ClueRemark.vue";

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
    AiLocationShow,
    AiInputSwitch,
    ClueRemark,
  },
})
export default class Home extends Mixins(SyncMixin) {
  showClueRemark: boolean = false;
  show: boolean = false;
  zones: any = [];

  get statusImg() {
    return require("@/asset/image/s-expired" + this.$densityStr + ".png");
  }

  get cover() {
    return (
      _get(this.merchant, "cover") ||
      require("@/asset/image/default/cover-merchant.png")
    );
  }

  get address() {
    if (isEmpty(this.merchant)) return "";

    const info = this.merchant.ad_info;
    if (isEmpty(info)) return "";

    const address = this.merchant.address;
    const prefix = `${info.province}${info.city}${info.district}`;
    return startsWith(address, prefix) ? address : `${prefix}${address}`;
  }

  get phone() {
    return trim(this.merchant.tel || "");
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

  get showHome() {
    return this.merchant.related_merch_id && this.merchant.related_merch_id > 0;
  }

  get showClue() {
    return this.merchant.related_clue_id && this.merchant.related_clue_id > 0;
  }

  get merchant() {
    return this.entity;
  }

  created() {
    this.store = "mongoMerchant";
    this.load();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    if (this.$route.name === "crmMerchant") {
      this.load();
    }
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
      reset: true,
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
    this.$router.replace({
      name: "crmZoneList",
    });
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

  goWebsite() {
    this.$router.push({
      name: "websiteMerchant",
      params: {
        merchantId: this.merchant.related_merch_id,
      },
    });
  }

  goClue() {
    this.$router.push({
      name: "crmCustomerDetail",
      params: {
        customerId: this.merchant.related_clue_id,
      },
    });
  }

  call() {
    if (!isEmpty(this.merchant.tel)) {
      this.$tools.call(this.merchant.tel);
    }
  }

  beRelatedClue() {
    if (this.merchant.related_clue_id && this.merchant.related_clue_id > 0) {
      this.goClue();
      return;
    }

    if (isEmpty(trim(this.merchant.tel))) {
      this.$hui.toast.error("请先补充正确的电话号码信息");
      return;
    }

    this.showClueRemark = true;
  }
}
</script>
<style lang="scss" scoped>
.merchant {
  position: relative;
  padding: 10px 10px 50px 10px;

  .status {
    position: absolute;
    top: 50vh;
    right: 10px;
  }

  .body {
    padding: 10px;

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
          align-items: center;
          justify-content: flex-start;

          & > span:first-child {
            text-align: right;
            min-width: 70px;
            font-size: 16px;
            font-weight: 800;
            margin-right: 10px;
          }

          .phone {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            i {
              display: inline-block;
              transform: rotate(180deg);
              background: green;
              padding: 5px;
              color: #fff;
              border-radius: 10px;

              box-shadow: 0px 0px 10px green;
            }
          }
        }

        .navs {
          display: flex;
          padding: 0px 20px;

          .nav {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            margin: 5px 10px;

            i {
              font-size: 40px;
              color: #67c23a;
            }

            .i-clue {
              font-size: 56px;
              font-weight: 600;
            }

            span {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
