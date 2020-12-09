<template>
  <div class="wrapper dashboard">
    <popup-search-bar
      :class="[
        'search',
        'animate__animated',
        'animate__faster',
        show ? 'animate__slideInDown' : 'animate__slideOutUp',
      ]"
    />
    <map-v class="map" />
    <popup-content-container
      :class="[
        'conatiner',
        'animate__animated',
        'animate__faster',
        show ? 'animate__slideInUp' : 'animate__slideOutDown',
      ]"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MapV from "./component/Map.vue";
import PopupSearchBar from "./component/PopupSearchBar.vue";
import PopupContentContainer from "./component/PopupContentContainer.vue";

@Component({
  components: {
    MapV,
    PopupSearchBar,
    PopupContentContainer,
  },
})
export default class Home extends Vue {
  show: boolean = false;
  created() {
    this.$bus.$on("map:dbclicked", () => {
      this.show = !this.show;
      console.log(this.show);
      this.$forceUpdate();
    });
  }
}
</script>
<style lang="scss" scoped></style>
