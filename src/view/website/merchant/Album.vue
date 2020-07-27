<template>
  <div class="wrapper album">
    <ai-list-stored
      v-if="album.merchant"
      resource="albumPhoto"
      :query="query"
      scrollType="waterfall"
      :waterfallOptions="{
        w_text: album.merchant.name,
      }"
    >
      <template v-slot:item="{ item }">
        <album-photo :photo="item" :key="item.id" :merchant="album.merchant" />
      </template>
      <template v-slot:innerFooter>
        <ai-copyright :manual="true" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiCopyright from "@/view/component/AiCopyright.vue";

import AlbumPhoto from "../component/AlbumPhoto.vue";

@Component({
  components: {
    AiListStored,
    AlbumPhoto,
    AiCopyright,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get albumId() {
    return this.$route.params.albumId;
  }
  get album() {
    return this.entity;
  }

  get query() {
    return {
      album_id: this.albumId,
    };
  }

  created() {
    this.store = "album";
    this.id = this.albumId;
    this.loadEntity({
      query: {
        extras: "merchant,count_photo",
        sort: "id asc",
      },
    });
  }

  @Watch("album", { deep: true })
  onAlbumChanged() {
    this.$store.commit(
      "updateTitle",
      `${this.album.title}(${this.album.count_photo})`
    );
  }

  openWebsite() {
    this.$router.push({
      name: "websiteMerchant",
      params: {
        merchantId: this.album.merchant_id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.album {
  height: 100vh;
}
</style>
