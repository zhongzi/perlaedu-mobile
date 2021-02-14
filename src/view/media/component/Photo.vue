<template>
  <div class="wrapper photo" @click="gotoDetail">
    <div :id="vecId" v-show="false" />
    <div class="cell" v-if="showMerged && innerFrame && mergedUrl">
      <img :src="mergedUrl" />
    </div>

    <div class="cell" v-else>
      <div :style="mergedStyle">
        <img :src="photo.url | alioss({ width: 200 })" />
      </div>
      <img
        v-if="innerFrame"
        :src="innerFrame.url | alioss({ width: 200 })"
        class="innerFrame"
      />
    </div>

    <div class="info" v-if="showInfo">
      <span> {{ photo.title }} </span>
      <span> (发表于 {{ photo.published_at | defaultDay }} ) </span>
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

import { getPhotoZoneInFrame, getPosterData } from "./util";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import debounce from "lodash/debounce";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) photo: any;
  @Prop({ type: Object, default: null }) frame: any;
  @Prop({ type: Object, default: null }) link: any;
  @Prop({ type: Boolean, default: false }) showMerged: boolean;
  @Prop({ type: Boolean, default: false }) showInfo: boolean;
  @Prop({ type: Boolean, default: true }) enabledClickToDetail: boolean;
  @Prop({ type: Boolean, default: true }) enabledPhotoFrame: boolean;

  vecId: string = null;
  mergedUrl = "";
  computedPosition: any = null;
  posterBuilder: any = null;
  debBuild: any = null;

  get innerFrame() {
    return (this.enabledPhotoFrame && _get(this.photo, "frame")) || this.frame;
  }

  get mergedStyle() {
    if (!this.computedPosition) {
      return {
        width: "100%",
        height: "100%",
        margin: "10%",
      };
    }

    const marginLeftRight = (
      (this.computedPosition.left * 100) /
      this.innerFrame.width
    ).toFixed(2);
    const marginTopBottom = (
      (this.computedPosition.top * 100) /
      this.innerFrame.height
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
    if (!this.photo || !this.innerFrame) return;

    this.computedPosition = getPhotoZoneInFrame(
      this.photo.file,
      this.innerFrame
    ).area;
    this.debBuild();
  }

  gotoDetail() {
    if (!this.enabledClickToDetail) return;
    if (isEmpty(this.photo)) return;

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
    if (!this.showMerged || !this.computedPosition || !this.innerFrame) return;

    const posterData = getPosterData(this.photo, this.innerFrame, null, 1000);

    if (!this.posterBuilder) {
      this.posterBuilder = new this.$PosterBuilder();
    }
    this.posterBuilder.setData(
      this.vecId,
      posterData.name,
      posterData.template,
      posterData.elements,
      posterData.baseWidth,
      posterData.baseHeight,
      (url) => {
        this.mergedUrl = url;
      }
    );
    try {
      this.posterBuilder.initKonva();
      this.posterBuilder.build();
    } catch (e) {
      console.log(e);
    }
  }
}
</script>
<style lang="scss" scoped>
.photo {
  .cell {
    width: 100%;
    height: 100%;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    line-height: 3;

    span {
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
    }
    span:nth-child(2) {
      color: #b5b5b5;
      margin-top: 5px;
    }

    .stars {
      color: red;
      margin-left: 10px;
    }
  }
}
</style>
