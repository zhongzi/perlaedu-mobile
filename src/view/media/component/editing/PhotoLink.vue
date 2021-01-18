<template>
  <div class="wrapper editing-link">
    <add-links :medias="medias" mode="no-dailog" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AddLinks from "../album/editing/AddLinks.vue";

import concat from "lodash/concat";

@Component({
  components: {
    AddLinks,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: null }) medias: any;
}
</script>
<style lang="scss" scoped></style>
