<template>
  <div class="wrapper">
    <ai-card @click.native="openAlbum">
      <template v-slot:header>
        <div class="header">
          <img
            class="cover"
            :src="
              album.cover | alioss({ width: 200, height: 150, mode: 'fill' })
            "
          />
        </div>
      </template>
      <template v-slot:body>
        <div class="name">{{ album.title }}</div>
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
  padding: 5px;
  margin-bottom: 15px;

  .header {
    width: 184px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;

    .cover {
      max-width: 100%;
      max-height: 100%;
      border-radius: 4px;
    }
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    text-align: center;

    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(74, 74, 74, 1);
    line-height: 18px;
  }
}
</style>
