<template>
  <div class="wrapper">
    <ai-card class="campaign" v-if="campaign" @click.native="gotoCampaign">
      <template v-slot:header>
        <div class="header">
          <img
            class="cover"
            :src="campaign.cover | alioss({ width: 200, height: 250 })"
          />
        </div>
      </template>
      <template v-slot:footer>
        <div class="title">{{ campaign.title }}</div>
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
  @Prop({ type: Object, default: null }) campaign: any;
  @Prop({ type: Object, default: null }) merchant: any;

  gotoCampaign() {
    window.location.href = this.campaign.url;
    return;
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  .campaign {
    height: 172px;
    text-align: center;
    margin-bottom: 20px;

    .title {
      margin: 5px auto;
    }
    .header {
      height: 132px;
      border-radius: 4px;
      margin: 4px;
      overflow: hidden;

      .cover {
        object-fit: fill;
        border-radius: 4px;
      }
    }
  }
}
</style>
