<template>
  <ai-content-media-editor
    :class="b()"
    :content="content"
    :medias="medias"
    :isEditing="false"
    :showAlbums="showAlbums"
    :albums="albums"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiContentMediaEditor from "./AiContentMediaEditor.vue";

@Component({
  name: "ai-content-media",
  components: {
    AiContentMediaEditor,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) content: string;
  @Prop({ type: Array, default: null }) medias: any;
  @Prop({ type: Boolean, default: false }) showAlbums: boolean;
  @Prop({ type: Array, default: null }) albums: any;
}
</script>
<style lang="scss" scoped>
.ai-content-media {
}
</style>
