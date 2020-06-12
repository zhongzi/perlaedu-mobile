<template>
  <div class="wrapper">
    <ai-card
      class="campaign"
      v-if="campaign"
      :cover="campaign.cover | alioss({ width: 200, height: 250 })"
      :content="campaign.title"
      @click.native="gotoCampaign"
    />
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
    overflow: hidden;
    text-align: center;
    padding: 5px;

    margin-bottom: 20px;
  }
}
</style>
