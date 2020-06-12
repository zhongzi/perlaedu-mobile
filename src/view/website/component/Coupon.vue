<template>
  <div class="wrapper">
    <ai-cell v-if="coupon">
      <template v-slot:title>
        <span> {{ coupon.title }} </span>
      </template>
      <template v-slot:subtitle>
        <div>
          <span> {{ coupon.price }} </span> 元
        </div>
      </template>
      <template v-slot:right>
        <hui-button @click="take"> 立即领取 </hui-button>
      </template>
    </ai-cell>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) coupon: any;

  take() {
    alert("TODO");
  }
}
</script>
