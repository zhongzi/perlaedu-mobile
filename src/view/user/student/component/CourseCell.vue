<template>
  <ai-card class="wrapper course-cell">
    <template v-slot:body>
      <div class="course">
        <div class="left">
          <span> {{ course.name }} </span>
          <span> {{ course.person.realname }} </span>
        </div>
        <div class="right">
          <template v-if="isNormalCardType">
            <span> {{ course.balance }} </span>
            <span> {{ balanceName }} </span>
          </template>
          <template v-else>
            <span> {{ cardType.text }} </span>
          </template>
          <span v-if="expireAt"> {{ expireAt }} 过期</span>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="merchant" @click="gotoWebsite">
        <img :src="course | safe('person.merchant.logo_url')" />
        <span> {{ course | safe("person.merchant.name") }} </span>
      </div>
    </template>
  </ai-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiLine from "@/view/component/AiLine.vue";
import AiCard from "@/view/component/AiCard.vue";

import { TagType, CardType } from "@/enum/tag";

import _get from "lodash/get";

@Component({
  components: {
    AiLine,
    AiCard,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: () => ({}) }) course: any;

  get balanceName() {
    return TagType[this.course.type_].text;
  }

  get expireAt() {
    const expireAt = this.course.expire_at;
    if (expireAt) {
      return this.$options.filters.distanceFromDatetime(expireAt, true);
    }
  }

  get cardType() {
    return CardType[this.course.card_type];
  }

  get isNormalCardType() {
    return this.cardType === CardType.normal;
  }

  gotoWebsite() {
    if (_get(this.course, "person.merchant.website")) {
      this.$router.push({
        name: "websiteMerchant",
        params: {
          merchantId: this.course.person.merchant.id,
        },
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.course-cell {
  border-radius: 0px;
  background: #ffffff;
  box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.05);
  border-radius: 4px;

  & ::v-deep .ai-card__body {
    border-bottom: 3px dotted #f5f5f5;
  }

  .course {
    padding: 10px 15px;

    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      flex-direction: column;
      line-height: 1.2;

      span:nth-child(1) {
        font-size: 20px;
        font-weight: 800;
      }
      span:nth-child(2) {
        font-size: 14px;
        color: #928e8e;
      }
    }
    .right {
      min-height: 65px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      line-height: 1.2;

      span {
        font-size: 14px;
        color: #928e8e;
      }

      span:nth-child(1) {
        font-size: 24px;
        font-weight: 800;
        color: #000000;
      }
      span:nth-child(2) {
        margin-bottom: 5px;
      }
    }
  }
  .merchant {
    padding: 5px 15px;
    display: flex;
    align-items: center;

    img {
      display: block;
      width: 30px;
      border-radius: 8px;
      margin-right: 10px;
    }
    span {
      font-size: 14px;
      color: #928e8e;
    }
  }
}
</style>
