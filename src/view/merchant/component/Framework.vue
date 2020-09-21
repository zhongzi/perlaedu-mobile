<template>
  <div class="wrapper framework">
    <framework-header>
      <template v-slot>
        <slot name="header" />
      </template>
    </framework-header>
    <framework-body>
      <template v-slot>
        <slot name="body" />
      </template>
    </framework-body>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import FrameworkHeader from "./FrameworkHeader.vue";
import FrameworkBody from "./FrameworkBody.vue";

@Component({
  components: {
    FrameworkHeader,
    FrameworkBody,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.framework {
  width: 100%;
}
</style>
