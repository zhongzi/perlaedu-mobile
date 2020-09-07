<template>
  <div class="wrapper pending">
    <img src="~@/asset/image/upgrading.png" />
    <ai-copyright :manual="true" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiCopyright from "@/view/component/AiCopyright.vue";

@Component({
  components: {
    AiCopyright,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.pending {
  width: 100%;
  height: 100vh;
  background: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
</style>
