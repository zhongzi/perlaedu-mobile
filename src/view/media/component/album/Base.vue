<template>
  <div class="wrapper album-detail-base">
    <template
      v-if="curAlbumComponentProps && curAlbumComponentProps.merchantId"
    >
      <component
        :is="curAlbumComponent"
        v-bind="curAlbumComponentProps"
      ></component>
      <div class="actions" v-if="isEditable">
        <div class="action" @click="gotoHome">
          <i class="iconfont icon-home" />
          <span> 首页 </span>
        </div>
        <div class="action" @click="gotoEditing">
          <i class="iconfont icon-upload" />
          <span> 上传 </span>
        </div>
        <div class="action" @click="gotoAlbumPlayer">
          <i class="iconfont icon-gallery" />
          <span> 画廊 </span>
        </div>
        <div v-if="isDeletable" class="action" @click="removeAlbum">
          <i class="iconfont icon-shanchu" />
          <span> 删除 </span>
        </div>
        <div
          :class="['action', { 'action-select-clicked': enabledSelect }]"
          @click="onClickSelected"
        >
          <i class="iconfont icon-checked" />
          <span> 选择 </span>
        </div>
      </div>
      <ai-list-stored
        class="photos"
        resource="mediaLink"
        scrollHeight="65vh"
        :query="query"
        :refresh.sync="refresh"
        @emit-list="updateTotal"
      >
        <template v-slot:item="{ item }">
          <photo
            :photo="item.media"
            :link="item"
            :key="item.id"
            :class="['photo', { 'photo-selected': checkSelected(item) }]"
            :enabledClickToDetail="enabledClickToDetail"
            @click.native="addToSelectedLink(item)"
          />
        </template>
      </ai-list-stored>
      <ai-fixed-footer>
        <div
          :class="[
            'select-actions',
            'animate__animated',
            {
              animate__fadeInUp: showFooter,
              animate__fadeOutDown: !showFooter,
            },
          ]"
        >
          <action-set-cover :links="selectedLinks" />
          <action-editing :links="selectedLinks" />
          <action-remove :links="selectedLinks" @deleted="onDeleted" />
          <action-copy :links="selectedLinks" v-if="showFooter" />
          <action-move
            v-if="showFooter"
            :links="selectedLinks"
            @moved="refresh = true"
          />
        </div>
      </ai-fixed-footer>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCell from "@/view/component/AiCell.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import ActionSetCover from "./editing/ActionSetCover.vue";
import ActionEditing from "./editing/ActionEditing.vue";
import ActionRemove from "./editing/ActionRemove.vue";
import ActionCopy from "./editing/ActionCopy.vue";
import ActionMove from "./editing/ActionMove.vue";

import Photo from "../Photo.vue";

import { checkEditable } from "../util";
import _get from "lodash/get";
import indexOf from "lodash/indexOf";
import concat from "lodash/concat";
import pull from "lodash/pull";
import clone from "lodash/clone";

@Component({
  components: {
    AiCell,
    AiListStored,
    AiFixedFooter,
    ActionSetCover,
    ActionEditing,
    ActionRemove,
    ActionCopy,
    ActionMove,
    Photo,
  },
})
export default class Home extends Mixins(SyncMixin) {
  curAlbumComponent = null;
  curAlbumComponentProps: any = null;

  isDeletable = false;
  isEditable = false;
  enabledClickToDetail = true;
  enabledSelect = false;
  selectedLinks: any = null;
  refresh = false;

  targetId: number = null;
  targetClass = "MediaAlbum";
  targetName = "";
  targetType: string = null;
  merchantId: number = null;

  get showFooter() {
    return (
      this.enabledSelect && this.selectedLinks && this.selectedLinks.length > 0
    );
  }

  get query() {
    return {
      target_class: this.targetClass,
      target_id: this.targetId,
      extras: JSON.stringify({
        MediaLink: ["media"],
        Media: ["frame", "file", "url"],
      }),
    };
  }

  created() {
    this.resetTarget();
    this.$bus.$on("album:cover:changed", (this as any).load);
  }

  activated() {
    this.resetTarget();
  }

  resetTarget() {
    this.targetType = this.$route.query.type as string;
    this.targetId = parseInt(this.$route.params.albumId);
    this.merchantId = parseInt(this.$route.query.merchantId as string);
  }

  updateTotal(v) {
    this.curAlbumComponentProps = this.curAlbumComponentProps || {};
    this.curAlbumComponentProps.total = v.total;
    return;
  }

  checkEditable(merchantId = null, openid = null, id = null) {
    return checkEditable(this.$auth.user, merchantId, openid, id);
  }

  gotoHome() {
    this.$router.push({
      name: "mediaMerchant",
    });
  }

  gotoEditing() {
    this.$router.push({
      name: "mediaPhotoEditing",
      params: {
        mediaId: "new",
      },
      query: {
        albums: JSON.stringify([
          {
            id: this.targetId,
            cls: this.targetClass,
            name: this.targetName,
            type: this.targetType,
          },
        ]),
      },
    });
  }

  gotoAlbumPlayer() {
    this.$router.push({
      name: "mediaAlbumPlayer",
      query: {
        target_id: this.targetId + "",
        target_class: this.targetClass,
      },
    });
  }

  removeAlbum() {
    if (this.isDeletable) {
      this.$hui.confirm.show({
        title: "删除确认",
        message: "确认从当前相册?",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: () => {
          this.deleteEntity({
            store: "mediaAlbum",
            id: this.targetId,
            success: () => {
              this.$nextTick(() => {
                this.$router.go(-1);
              });
            },
          });
        },
        onCancel: () => {},
      });
    }
  }

  onClickSelected() {
    this.selectedLinks = null;
    this.enabledSelect = !this.enabledSelect;
    this.enabledClickToDetail = !this.enabledClickToDetail;
  }

  checkSelected(item) {
    return this.selectedLinks && indexOf(this.selectedLinks, item) >= 0;
  }

  addToSelectedLink(item) {
    if (this.enabledClickToDetail) return;

    this.selectedLinks = this.checkSelected(item)
      ? clone(pull(this.selectedLinks, item))
      : concat(this.selectedLinks || [], item);
  }

  onDeleted() {
    this.refresh = true;
    this.selectedLinks = null;
  }
}
</script>
<style lang="scss">
.album-detail-base {
  padding: 10px 20px;

  .header {
    background: #fff;
    padding: 10px;

    .ai-cell__left-cover {
      width: 80px;
    }
  }
  .actions {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    margin: 10px auto;

    .action-select-clicked {
      background: #ff6452;
      color: #fff;
    }

    .action-disabled {
      color: #d6d3d3;
    }

    .action {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      padding: 5px;
      border-radius: 8px;

      i {
        font-size: 20px;
      }
      span {
        font-size: 13px;
      }
    }
  }
  .photos {
    .ai-infinite-scroll__list {
      justify-content: space-between;
    }
    .photo {
      width: 47%;
      margin: 1%;
    }
    .photo-selected {
      box-shadow: 0px 0px 10px red;
    }
  }
}
.select-actions {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
  background: #fff;

  .action {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .action-disabled {
    color: #d4d4d4;
  }
  span {
    font-size: 12px;
  }
}
</style>
