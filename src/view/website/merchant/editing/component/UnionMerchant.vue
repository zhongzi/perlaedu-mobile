<template>
  <div class="wrapper editing-union">
    <ai-card>
      <template v-slot:header>
        <div class="header">
          <ai-cell class="union">
            <template v-slot:cover>
              <div class="cover">
                <img
                  :src="union.cover_url | alioss({ width: 240, height: 160 })"
                />
              </div>
            </template>
            <template v-slot:title>
              <span class="title"> {{ union.name }} </span>
            </template>
            <template v-slot:subtitle>
              <div class="subtitle">
                <ai-button-round-small>
                  <span class="desc">
                    共
                    {{ unionMerchant | safe("union.count_merchants", 0) }}
                    家机构
                  </span>
                </ai-button-round-small>
                <span class="datetime">
                  {{ unionMerchant.created_at | defaultDay }} 加入</span
                >
              </div>
            </template>
          </ai-cell>
        </div>
      </template>
      <template v-slot:body>
        <div class="numbers">
          <ai-number
            class="number"
            :num="unionMerchant.benefits"
            label="贡献"
          />
          <ai-number
            class="number"
            :num="unionMerchant.contributions"
            label="受益"
          />
          <ai-number
            class="number"
            :num="unionMerchant.contributions_pure"
            label="净受益"
          />
          <ai-number
            class="number"
            :num="unionMerchant.rank"
            label="净受益排名"
          />
        </div>
      </template>
    </ai-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiButtonRoundSmall from "@/view/component/AiButtonRoundSmall.vue";
import AiCell from "@/view/component/AiCell.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiNumber from "@/view/component/AiNumber.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiCell,
    AiCard,
    AiNumber,
    AiButtonRoundSmall,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) unionMerchant: any;

  get union() {
    return _get(this.unionMerchant, "union", {});
  }
}
</script>
<style lang="scss" scoped>
.editing-union {
  .header {
    width: 100%;

    background: linear-gradient(
      136deg,
      rgba(255, 207, 51, 1) 0%,
      rgba(255, 131, 6, 1) 100%
    );
    box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.04);
    opacity: 0.8;
    border-radius: 10px 10px 0px 0px;
  }

  .union {
    min-height: 68px;
    padding: 10px;

    .cover {
      width: 86px;
      min-width: 86px;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 5px;

      img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 4px;
      }
    }

    .title {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 21px;
      letter-spacing: 1px;
      text-shadow: 0px 3px 14px rgba(0, 0, 0, 0.04);
    }

    .subtitle {
      display: flex;
      align-items: center;

      .desc {
        font-size: 10px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 122, 6, 1);
        line-height: 14px;
        text-shadow: 0px 3px 14px rgba(0, 0, 0, 0.04);
      }

      .datetime {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 255, 255, 1);
        line-height: 16px;
        text-shadow: 0px 3px 14px rgba(0, 0, 0, 0.04);
        margin-left: 10px;
      }
    }
  }
  .numbers {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 10px 0px;

    .number {
      flex-basis: 1;
      min-width: 80px;
    }
  }
}
</style>
