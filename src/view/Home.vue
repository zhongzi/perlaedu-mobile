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

@Component
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
</style>
