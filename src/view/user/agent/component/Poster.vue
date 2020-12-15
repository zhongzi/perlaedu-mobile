<template>
  <div class="wrapper poster">
    <div class="image">
      <ai-poster-sync
        v-if="posterTemplateId && posterTemplateId > 0"
        :templateId="posterTemplateId"
        :context="context"
      />
      <ai-poster v-else :poster="poster" :context="context" />
    </div>
    <div class="links">
      <ai-button-round
        class="link"
        @click.native="
          $router.push({
            name: 'billEditingProjects',
            query: {
              _merchant_id_: $configs.master_merchant_id,
            },
          })
        "
        >收款链接</ai-button-round
      >
      <ai-button-round
        class="link"
        @click.native="
          $router.push({
            name: 'billManagementDashboard',
            query: {
              _merchant_id_: $configs.master_merchant_id,
            },
          })
        "
        >收款明细</ai-button-round
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiButtonRound from "@/view/component/AiButtonRound.vue";
import AiPosterSync from "@/view/component/AiPosterSync.vue";
import AiPoster from "@/view/component/AiPoster.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiButtonRound,
    AiPosterSync,
    AiPoster,
  },
})
export default class Home extends Vue {
  get qrcode() {
    return _get(this.agent, "qrcode");
  }
  get posterTemplateId() {
    return _get(this.agent, "poster_tempid");
  }

  get agent() {
    return _get(this.$auth, "user.agent");
  }

  get poster() {
    return {
      name: `${_get(this.agent, "realname")}推广二维码`,
      template: {
        type: "image",
        value: "https://files.perlaedu.com/default/agent_bg_v3.jpg",
        options: {},
      },
      baseWidth: 375,
      baseHeight: 667,
      elements: [
        {
          type: "image",
          value: "${qrcode}",
          options: {
            x: 32,
            y: 475,
            width: 80,
            height: 80,
          },
        },
      ],
    };
  }

  get context() {
    return {
      qrcode: this.qrcode,
    };
  }

  quickEnter(url) {
    if (isEmpty(url)) return;
    location.href = url;
    return;
  }
}
</script>
<style lang="scss" scoped>
.poster {
  padding: 20px 20px 0px;

  .image {
    width: 80vw;
    min-height: 60vh;
    margin: auto;

    & ::v-deep img {
      border-radius: 10px;
    }

    .title {
      text-align: center;
      font-size: 18px;
      font-weight: 900;
      margin-bottom: 10px;
    }
  }
  .links {
    padding: 10px 20px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
