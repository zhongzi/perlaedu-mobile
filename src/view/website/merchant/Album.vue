<template>
  <div class="wrapper album">
    <ai-list-stored resource="albumPhoto" :query="query" scrollType="waterfall">
      <template v-slot:header>
        <div class="header">
          <div class="title">{{ album.title }}</div>
          <div class="merchant" @click="openWebsite">
            {{ album | safe("merchant.name") }}
          </div>
          <div class="datetime">
            最后更新: {{ album.updated_at | defaultDate }}
          </div>
        </div>
      </template>
      <template v-slot:item="{ item }">
        <album-photo :photo="item" :key="item.id" />
      </template>
      <template v-slot:innerFooter>
        <ai-copyright :manual="true" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

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
        extras: "merchant",
        sort: "id asc",
      },
    });
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
  img {
    width: 100%;
  }

  .header {
    text-align: center;
    .title {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(74, 74, 74, 1);
      line-height: 3;
    }
    .merchant {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 600;
      line-height: 1;
      color: #0099cc;
    }
    .datetime {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 600;
      color: rgba(155, 155, 155, 1);
      line-height: 1;
      margin-bottom: 20px;
    }
  }
}
</style>
