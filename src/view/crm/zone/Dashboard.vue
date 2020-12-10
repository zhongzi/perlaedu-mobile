<template>
  <div class="wrapper dashboard">
    <map-v class="map" />
    <popup-content-container
      :class="[
        'container',
        { expanded: expanded },
        { 'no-expanded': !expanded },
      ]"
      v-touch:swipe.top="onSwipeToTop"
      v-touch:swipe.bottom="onSwipeToBottom"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MapV from "./component/Map.vue";
import PopupContentContainer from "./component/PopupContentContainer.vue";

@Component({
  components: {
    MapV,
    PopupContentContainer,
  },
})
export default class Home extends Vue {
  expanded: boolean = false;

  created() {
    this.$bus.$on("map:search:changed", this.onSwipeToTop);
  }

  onSwipeToTop() {
    this.expanded = true;
  }
  onSwipeToBottom() {
    this.expanded = false;
  }
}
</script>
<style lang="scss" scoped>
.dashboard {
  .container {
    overflow: hidden;
  }
  .expanded {
    height: 50vh;
    transition: height 0.5s ease-in-out;
  }
  .no-expanded {
    height: 135px;
    transition: height 0.5s ease-in-out;
  }
}
</style>
