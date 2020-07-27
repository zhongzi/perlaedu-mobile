<template>
  <div class="wrapper">
    <ai-card @click.native="openAlbum">
      <template v-slot:header>
        <div class="header">
          <img
            class="cover"
            :src="
              album.cover | alioss({ width: 184, height: 110, mode: 'fill' })
            "
          />
        </div>
      </template>
      <template v-slot:footer>
        <div class="title">
          <i class="iconfont icon-album" />
          <span> {{ album.title }} </span>
        </div>
      </template>
    </ai-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiSlider from "@/view/component/AiSlider.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiCard,
    AiSlider,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) album: any;
  @Prop({ type: String, default: "websiteMerchantAlbum" }) routeName: string;

  openAlbum() {
    this.$router.push({
      name: this.routeName,
      params: {
        albumId: this.album.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 194px;
  height: 148px;

  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  margin-bottom: 15px;

  .header {
    height: 110px;
    border-radius: 4px;
    overflow: hidden;
    border-radius: 4px;
    overflow: hidden;
    margin: 4px;

    .cover {
      border-radius: 4px;
      object-fit: fill;
    }
  }

  .title {
    display: flex;
    align-items: center;
    margin: 0px 10px;

    text-align: center;
    line-height: 1.5;
    i {
      font-size: 20px;
      color: rgba(237, 139, 65, 1);
      margin-right: 10px;
    }

    span {
      max-width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
    }
  }
}
</style>
