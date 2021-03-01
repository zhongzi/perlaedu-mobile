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
        <template v-if="!isInRecycleBin">
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
          <div
            :class="['action', { 'action-select-clicked': enabledSelect }]"
            @click="onClickSelected"
          >
            <i class="iconfont icon-checked" />
            <span> 选择 </span>
          </div>
        </template>
        <div
          :class="['action', { 'action-select-clicked': isInRecycleBin }]"
          @click="openRecycleBin"
        >
          <i class="iconfont icon-huifu" />
          <span> {{ isInRecycleBin ? "退出" : "" }}回收站 </span>
        </div>
      </div>
      <ai-list-stored
        class="photos"
        resource="mediaLink"
        scrollHeight="100%"
        :query="query"
        :refresh.sync="refresh"
        @emit-list="updateTotal"
      >
        <template v-slot:list>
          <div class="groups">
            <div class="group" v-for="group in linksGroups" :key="group[0]">
              <div class="label">
                {{ group[0] }}
              </div>
              <div class="links">
                <div class="link" v-for="link in group[1]" :key="link.id">
                  <ai-state-check-mask
                    :enableCheck="!enabledClickToDetail"
                    :checked="checkSelected(link)"
                    @update:checked="addToSelectedLink(link)"
                  >
                    <photo
                      :photo="link.media"
                      :link="link"
                      :key="link.id"
                      :enabledClickToDetail="enabledClickToDetail"
                    />
                  </ai-state-check-mask>
                </div>
              </div>
            </div>
          </div>
        </template>
      </ai-list-stored>
      <ai-fixed-footer v-show="showFooter">
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
          <template v-if="!isInRecycleBin">
            <action-set-cover :links="selectedLinks" />
            <action-editing :links="selectedLinks" />
            <action-remove :links="selectedLinks" @deleted="onDeleted" />
            <action-copy :links="selectedLinks" v-if="showFooter" />
            <action-move
              v-if="showFooter"
              :links="selectedLinks"
              @moved="refresh = true"
            />
          </template>
          <template v-else>
            <action-recover-in-recycle-bin
              :targetId="targetId"
              :targetClass="targetClass"
              :links="selectedLinks"
              @finished="refresh = true"
            />
            <action-remove-in-recycle-bin
              :targetId="targetId"
              :targetClass="targetClass"
              :links="selectedLinks"
              @finished="refresh = true"
            />
          </template>
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
import AiStateCheckMask from "@/view/component/AiStateCheckMask.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import ActionSetCover from "./editing/ActionSetCover.vue";
import ActionEditing from "./editing/ActionEditing.vue";
import ActionRemove from "./editing/ActionRemove.vue";
import ActionCopy from "./editing/ActionCopy.vue";
import ActionMove from "./editing/ActionMove.vue";
import ActionRemoveInRecycleBin from "./editing/ActionRemoveInRecycleBin.vue";
import ActionRecoverInRecycleBin from "./editing/ActionRecoverInRecycleBin.vue";

import Photo from "../Photo.vue";

import { checkEditable } from "../util";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import find from "lodash/find";
import concat from "lodash/concat";
import pull from "lodash/pull";
import clone from "lodash/clone";
import groupBy from "lodash/groupBy";
import toPairs from "lodash/toPairs";
import orderBy from "lodash/orderBy";
import filter from "lodash/filter";

@Component({
  components: {
    AiCell,
    AiListStored,
    AiFixedFooter,
    AiStateCheckMask,
    ActionSetCover,
    ActionEditing,
    ActionRemove,
    ActionCopy,
    ActionMove,
    ActionRemoveInRecycleBin,
    ActionRecoverInRecycleBin,
    Photo,
  },
})
export default class Home extends Mixins(SyncMixin) {
  curAlbumComponent = null;
  curAlbumComponentProps: any = null;
  curLinks: any = null;

  isInRecycleBin = false;

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

  get linksGroups() {
    if (isEmpty(this.curLinks)) return [];

    const groups = orderBy(
      toPairs(
        groupBy(this.curLinks, (link) => {
          return this.$options.filters.defaultDay(link.media.published_at);
        })
      ),
      0,
      "desc"
    );
    console.log(groups);
    return groups;
  }

  get showFooter() {
    return (
      this.isInRecycleBin ||
      (this.enabledSelect &&
        this.selectedLinks &&
        this.selectedLinks.length > 0)
    );
  }

  get query() {
    return {
      target_class: this.targetClass,
      target_id: this.targetId,
      is_deleted_tmp: this.isInRecycleBin,
      sort: "published_at desc, id desc",
      extras: JSON.stringify({
        MediaLink: ["media"],
        Media: ["frame", "file", "url"],
      }),
    };
  }

  created() {
    this.resetTarget();
    this.$bus.$on("album:cover:changed", (this as any).load);
    this.$bus.$on("album:refresh", () => {
      if (this.targetType === "course") {
        (this as any).load(() => {
          this.refresh = true;
        });
      } else {
        this.refresh = true;
      }
    });
  }

  activated() {
    this.resetTarget();
  }

  resetTarget() {
    this.targetType = this.$route.query.type as string;
    this.targetId = parseInt(this.$route.params.albumId) || 0;
    this.merchantId = parseInt(this.$route.query.merchantId as string);
    (this as any).load();
  }

  updateTotal(v) {
    this.curAlbumComponentProps = this.curAlbumComponentProps || {};
    this.curAlbumComponentProps.total = v.total;
    this.curLinks = v.list;
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
        type: this.targetType,
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

  openRecycleBin() {
    if (this.enabledSelect) {
      this.enabledSelect = false;
      this.enabledClickToDetail = true;
    }

    this.selectedLinks = null;
    this.isInRecycleBin = !this.isInRecycleBin;
    this.enabledClickToDetail = !this.enabledClickToDetail;
  }

  onClickSelected() {
    if (this.isInRecycleBin) return;

    this.selectedLinks = null;
    this.enabledSelect = !this.enabledSelect;
    this.enabledClickToDetail = !this.enabledClickToDetail;
  }

  checkSelected(item) {
    return !!(this.selectedLinks && find(this.selectedLinks, { id: item.id }));
  }

  addToSelectedLink(item) {
    if (this.enabledClickToDetail) return;

    this.selectedLinks = this.checkSelected(item)
      ? filter(this.selectedLinks, (link) => link.id !== item.id)
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
    padding: 5px;
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
      padding: 3px;
      margin: 0px auto;

      border-radius: 8px;
      line-height: 1.2;

      i {
        font-size: 14px;
      }
      span {
        font-size: 12px;
      }
    }
  }
  .photos {
    height: calc(100vh - 150px);
    .groups {
      width: 100%;

      .group {
        .label {
          font-size: 13px;
          font-weight: 800;
          border-left: 5px solid;
          padding-left: 5px;
        }
        .links {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .link ::v-deep .cell {
            width: 50%;
            height: 150px;
          }
        }
      }
    }
    .photo-cell {
      width: 47%;
      height: 200px;
      margin: 1%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
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
