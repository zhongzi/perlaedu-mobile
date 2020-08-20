<template>
  <div class="wrapper merchant">
    <ai-card @click.native="onClick" class="card">
      <template v-slot:header>
        <img
          class="cover"
          :src="merchant.cover_url | alioss({ width: 200, height: 150 })"
        />
      </template>
      <template v-slot:body>
        <div class="name">{{ merchant.name }}</div>
      </template>
    </ai-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";

@Component({
  components: {
    AiCard,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: () => ({}) }) merchant: any;

  onClick() {
    this.$router.push({
      name: "websiteMerchant",
      params: {
        merchantId: this.merchant.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.merchant {
  width: 194px;
  height: 148px;
  max-width: 194px;
  max-height: 148px;
  margin-bottom: 15px;

  .card {
    box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
    padding: 5px;

    .cover {
      border-radius: 4px;
    }

    .name {
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(74, 74, 74, 1);
      line-height: 2;
      text-shadow: 0px 14px 20px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
