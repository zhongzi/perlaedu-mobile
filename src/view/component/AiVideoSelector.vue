<template>
  <div :class="b()">
    <ai-list-stored
      scrollType="scroll"
      resource="video"
      :query="innerQuery"
      :refresh="refresh"
    >
      <template v-slot:header>
        <div :class="b('header')">
          <!--
          <ai-input v-model="keyword" placeholder="输入视频名称或标签" />
          -->
          <hui-button type="primary" @click.native.stop="upload" class="button">
            上传新视频
          </hui-button>
        </div>
      </template>
      <template v-slot:item="{ item }">
        <div :class="b('item')">
          <div :class="b('item-datetime')">
            {{ item.updated_at | date("yyyy-MM-dd HH:mm") }}
          </div>
          <ai-cell>
            <template v-slot:cover>
              <div :class="b('item-video')" @click="play(item)">
                <img :src="item.cover || defaultVideoCover" />
                <div :class="b('item-video-mask')">
                  <i class="iconfont icon-play" />
                </div>
              </div>
            </template>
            <template v-slot:title>
              <div :class="b('item-title')">
                {{ item.title }}
              </div>
            </template>
            <template v-slot:right>
              <ai-input-check @input="(v) => checked(item, v)" mode="icon" />
            </template>
          </ai-cell>
        </div>
        <ai-line />
      </template>
    </ai-list-stored>
    <ai-fixed-footer>
      <ai-submit-actions
        @cancel="$emit('cancel')"
        :submitLabel="'确定(' + selectedVideos.length + ')'"
        @submit="checkedOver"
      />
    </ai-fixed-footer>
    <hui-dialog v-model="showDialog">
      <div :class="b('dialog')">
        <ai-video-ali-uploader
          @uploaded="onUploaded"
          @cancel="showDialog = false"
        />
      </div>
    </hui-dialog>
    <hui-dialog v-model="showPlayer" v-if="showPlayer">
      <div :class="b('dialog-player')">
        <ai-video-ali-player :videoId="curVideo.id" />
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiInput from "./AiInput.vue";
import AiCell from "./AiCell.vue";
import AiLine from "./AiLine.vue";
import AiInputCheck from "./AiInputCheck.vue";
import AiListStored from "./AiListStored.vue";
import AiVideoAliUploader from "./AiVideoAliUploader.vue";
import AiVideoAliPlayer from "./AiVideoAliPlayer.vue";
import AiFixedFooter from "./AiFixedFooter.vue";
import AiSubmitActions from "./AiSubmitActions.vue";

import _get from "lodash/get";
import merge from "lodash/merge";
import pull from "lodash/pull";
import filter from "lodash/filter";

@Component({
  name: "ai-video-selector",
  components: {
    AiInput,
    AiCell,
    AiLine,
    AiInputCheck,
    AiListStored,
    AiVideoAliUploader,
    AiVideoAliPlayer,
    AiFixedFooter,
    AiSubmitActions,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  curVideo: any = null;
  keyword: string = "";
  refresh: boolean = true;
  showDialog: boolean = false;
  showPlayer: boolean = false;
  selectedVideos: any = [];

  get defaultVideoCover() {
    return require("@/asset/image/default_video_cover.jpg");
  }

  get innerQuery() {
    return merge(
      {
        filters: JSON.stringify({
          title: [this.keyword],
          keywords: [this.keyword],
        }),
      },
      this.query
    );
  }

  upload() {
    this.showDialog = true;
  }

  play(video) {
    this.curVideo = video;
    this.showPlayer = true;
  }

  checkedOver() {
    this.$emit("selected", this.selectedVideos);
  }

  onUploaded(video) {
    this.checked(video, true);
    this.showDialog = false;
  }

  checked(item, flag) {
    if (flag) {
      this.selectedVideos.push(item);
    } else {
      this.selectedVideos = filter(this.selectedVideos, (v) => {
        return v.id !== item.id;
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-video-selector {
  & ::v-deep .ai-infinite-scroll__list {
    position: relative;
    top: -20px;

    padding: 20px 30px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px -6px 18px 0px rgba(0, 0, 0, 0.04);
    border-radius: 22px 22px 0px 0px;
  }

  &__header {
    background: linear-gradient(
      119deg,
      rgba(255, 146, 73, 1) 0%,
      rgba(226, 99, 14, 1) 100%
    );
    min-height: 110px;

    display: flex;
    align-items: center;
    justify-content: center;

    .button {
      width: 307px;
      height: 48px;
      background: rgba(255, 255, 255, 1);
      border-radius: 24px;
      opacity: 0.86;

      font-size: 14px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: rgba(234, 128, 57, 1);
      line-height: 19px;
      letter-spacing: 1px;
    }
  }

  &__item {
    width: 100%;
    margin: 15px 0px;

    &-datetime {
      width: 100%;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(155, 155, 155, 1);
      line-height: 16px;
      margin-bottom: 10px;
    }

    &-title {
      font-size: 14px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: rgba(74, 74, 74, 1);
      line-height: 19px;
    }

    &-video {
      position: relative;
      width: 89px;
      height: 60px;
      background: linear-gradient(
        136deg,
        rgba(255, 207, 51, 1) 0%,
        rgba(255, 131, 6, 1) 100%
      );
      border-radius: 12px;
      overflow: hidden;
      margin-right: 10px;

      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        display: block;
      }

      &-mask {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        background: rgba(0, 0, 0, 0.6);

        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 18px;
          background: #fff;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
