<template>
  <div class="wrapper photo" @click="gotoDetail">
    <div :id="vecId" v-show="false" />
    <div class="cell" v-if="showMerged && photo.frame && mergedUrl">
      <img :src="mergedUrl" />
    </div>

    <div class="cell" v-else>
      <div class="merged" :style="mergedStyle">
        <img :src="photo.url" />
      </div>
      <img v-if="photo.frame" :src="photo.frame.url" class="frame" />
    </div>

    <div class="info" v-if="showInfo">
      <span> {{ photo.title }} </span>
      <!--
      <div class="stars">
         (
        <i class="iconfont icon-dianzan" />
        <span> {{ photo.count_star}} </span>
        )
      </div>
-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { getPhotoZoneFromFrame } from "./util";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import debounce from "lodash/debounce";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) photo: any;
  @Prop({ type: Object, default: null }) link: any;
  @Prop({ type: Boolean, default: true }) showMerged: boolean;
  @Prop({ type: Boolean, default: false }) showInfo: boolean;
  @Prop({ type: Boolean, default: true }) enabledClickToDetail: boolean;

  vecId: string = null;
  mergedUrl = "";
  computedPosition: any = null;
  posterBuilder: any = null;
  debBuild: any = null;

  get frame() {
    return _get(this.photo, "frame");
  }

  get file() {
    return _get(this.photo, "file");
  }

  get mergedStyle() {
    if (!this.computedPosition) return;

    const marginLeftRight = (
      (this.computedPosition.left * 100) /
      this.frame.width
    ).toFixed(2);
    const marginTopBottom = (
      (this.computedPosition.top * 100) /
      this.frame.height
    ).toFixed(2);
    return {
      position: "absolute",
      padding: "0px",
      left: `${marginLeftRight}%`,
      right: `${marginLeftRight}%`,
      top: `${marginTopBottom}%`,
      bottom: `${marginTopBottom}%`,
    };
  }

  created() {
    this.vecId = "vec-" + (this as any)._uid;
    this.debBuild = debounce(() => {
      this.build();
    }, 1000);

    this.getComputedPosition();
  }

  @Watch("photo", { deep: true })
  onPhotoChanged() {
    this.getComputedPosition();
  }

  getComputedPosition() {
    this.computedPosition = null;
    this.mergedUrl = null;
    if (!this.photo || !this.frame) return;

    this.computedPosition = getPhotoZoneFromFrame(
      {
        width: this.frame.width,
        height: this.frame.height,
        left: this.frame.left,
        top: this.frame.top,
        right: this.frame.right,
        bottom: this.frame.bottom,
      },
      {
        width: this.file.width,
        height: this.file.height,
      }
    );

    this.debBuild();
  }

  gotoDetail() {
    if (isEmpty(this.photo)) return;
    if (!this.enabledClickToDetail) return;

    this.$router.push({
      name: "mediaPhoto",
      params: {
        mediaId: this.photo.id,
      },
      query: {
        linkId: _get(this.link, "id"),
        type: this.$route.query.type,
      },
    });
  }

  build() {
    if (!this.showMerged || !this.computedPosition) return;

    const name = this.photo.title;
    const baseWidth = this.photo.frame.width;
    const baseHeight = this.photo.frame.height;
    const template = {
      type: "image",
      value: this.photo.frame.url,
      options: {},
    };
    const elements = [
      {
        type: "image",
        value: this.photo.url,
        options: {
          width: this.computedPosition.width,
          height: this.computedPosition.height,
          x: this.computedPosition.left,
          y: this.computedPosition.top,
        },
      },
    ];

    if (!this.posterBuilder) {
      this.posterBuilder = new this.$PosterBuilder();
    }
    this.posterBuilder.setData(
      this.vecId,
      name,
      template,
      elements,
      baseWidth,
      baseHeight,
      (url) => {
        // this.mergedUrl = url;
        //  this.$hui.loading.hide();
      }
    );
    this.posterBuilder.initKonva();
    // this.$hui.loading.show("正在制作中...");
    this.posterBuilder.build();
  }
}
</script>
<style lang="scss" scoped>
.photo {
  .cell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      display: block;
      width: 100%;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: space-around;
    line-height: 3;

    span {
      font-size: 14px;
      font-weight: 800;
    }

    .stars {
      color: red;
      margin-left: 10px;
    }
  }
}
</style>
