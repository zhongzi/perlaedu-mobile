<template>
  <div class="wrapper history">
    <div class="header">
      <template v-for="(nav, index) in navs">
        <span
          :key="index"
          :class="{ actived: nav === curNav }"
          @click="curNav = nav"
        >
          <span v-if="index > 0"> / </span>
          <span> {{ nav.title }} </span>
        </span>
      </template>
    </div>
    <div class="content">
      <template v-if="curNav.value === 'viewed'">
        <merchants-by-view />
      </template>
      <template v-else>
        <merchants-by-follow :query="query" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MerchantsByView from "./MerchantsByView.vue";
import MerchantsByFollow from "./MerchantsByFollow.vue";

@Component({
  components: {
    MerchantsByView,
    MerchantsByFollow,
  },
})
export default class Home extends Vue {
  navs: any = [
    {
      title: "浏览过的机构",
      value: "viewed",
    },
    {
      title: "关注中的机构",
      value: "following",
    },
    {
      title: "我就学的机构",
      value: "learning",
    },
  ];
  curNav: any = this.navs[0];

  get query() {
    return this.curNav.value === "learning"
      ? {
          only_student: true,
        }
      : {
          require_person: true,
        };
  }
}
</script>
<style lang="scss" scoped>
.history {
  .header {
    margin-left: 21px;

    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(74, 74, 74, 1);
    line-height: 3;

    .actived {
      color: rgba(255, 113, 18, 1);
    }
  }
}
</style>
