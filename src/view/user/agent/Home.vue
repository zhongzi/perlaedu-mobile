<template>
  <div>
    <transition>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
    </transition>
    <transition>
      <router-view v-if="!$route.meta.keepAlive" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import isEmpty from "lodash/isEmpty";

@Component
export default class Home extends Vue {
  created() {
    this.requireAgent();
  }

  activated() {
    this.requireAgent();
  }

  requireAgent() {
    if (isEmpty(this.$auth.user.agent)) {
      this.$router.push({
        name: "NotFound",
      });
    }
  }
}
</script>
<style lang="scss" scoped></style>
