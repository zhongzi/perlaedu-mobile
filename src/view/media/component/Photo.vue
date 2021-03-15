<template>
  <div class="wrapper photo" @click="gotoDetail">
    <div :id="vecId" v-show="false" />
    <div class="cell" v-if="showMerged && innerFrame && mergedUrl">
      <img :src="mergedUrl" @load="onLoaded" />
    </div>

    <div class="cell" v-else>
      <div :style="mergedStyle">
        <img :src="photo.url | alioss({ width: 375 })" @load="onLoaded" />
      </div>
      <img
        v-if="innerFrame"
        class="innerFrame"
        :src="innerFrame.url | alioss({ width: 375 })"
        @load="onLoaded"
      />
    </div>

    <div class="info" v-if="showInfo && link">
      <span class="title"> {{ title }} </span>
      <span class="subtitle"> {{ subTitle }} </span>
      <span class="description"> {{ description }} </span>
      <span class="published"> 创作于 </span>
      <span class="published"> {{ publishedAt }} </span>
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

  get media() {
    return _get(this.link, "media");
  }

  get person() {
    return (
      _get(this.link, "target_class") === "Person" && _get(this.link, "target")
    );
  }

  get isNoTitle() {
    return isEmpty(this.media.title);
  }

  get title() {
    return this.isNoTitle
      ? _get(this.person, "realname", "")
      : this.media.title;
  }
  get subTitle() {
    return (
      (!this.isNoTitle && this.person ? this.person.realname + " @ " : "") +
      _get(this.media, "merchant.name")
    );
  }
  get description() {
    return this.media.description;
  }
  get publishedAt() {
    return this.$options.filters.defaultDay(this.media.published_at);
  }

  get mergedStyle() {
    if (!this.computedPosition) {
      return {
        width: "100%",
        height: "100%",
        margin: "10%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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

  onLoaded() {
    this.$bus.$emit("infinite:scroll:refresh");
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
    justify-content: center;
    padding: 20px 40px;

    .title {
      font-size: 24px;
      font-weight: 800;
      line-height: 1.5;
    }
    .subtitle {
      font-size: 13px;
      line-height: 1;
      color: #848181;
    }
    .description {
      font-size: 12px;
      line-height: 1.2;
      color: #848181;
      margin: 10px 0px;
    }
    .published {
      font-size: 12px;
      line-height: 1.2;
      color: #848181;
    }
  }
}
</style>
