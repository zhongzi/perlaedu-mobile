<template>
  <div class="wrapper zone-add-entry">
    <ai-card
      :class="[isEditing ? 'editing' : '']"
      @click.native="isEditing = !isEditing"
    >
      <template v-slot:body>
        {{ isEditing ? "编辑" : "浏览" }} <br />
        模式
      </template>
    </ai-card>
    <ai-dialog v-model="showDialog" class="dialog">
      <ai-image-uploader type="crm" v-model="cover" />
      <ai-input class="field" label="区域名称" v-model="title" />
      <div class="title">负责人</div>
      <ai-selection-stored
        class="agents"
        v-model="follower.openid"
        resource="oauth"
        labelKey="nickname"
        valueKey="openid"
        :query="query"
        :enableUnsetOption="true"
        @selected="onSelected"
      />
      <ai-submit-actions
        deleteLabel="删除"
        @cancel="showDialog = false"
        @submit="submit"
        @deleted="onDelete"
      />
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiSelectionStored from "@/view/component/AiSelectionStored.vue";

import pick from "lodash/pick";
import _get from "lodash/get";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiDialog,
    AiCard,
    AiInput,
    AiImageUploader,
    AiSubmitActions,
    AiSelectionStored,
  },
})
export default class Home extends Mixins(SyncMixin) {
  showDialog: boolean = false;
  isEditing: boolean = false;

  zone: any = null;
  cover: string = "";
  title: string = "";
  follower: any = {};

  get query() {
    return {
      kind: ["agent", "admin"],
    };
  }

  created() {
    this.store = "mongoMerchantZone";

    this.$bus.$on("map:zone:saving", (zone) => {
      this.zone = zone;
      this.showDialog = true;
    });
  }

  @Watch("isEditing")
  onEditingChanged() {
    this.$bus.$emit("map:mode:editing", this.isEditing);
  }

  @Watch("zone")
  onZoneChanged() {
    this.cover = _get(this.zone, "cover", "");
    this.title = _get(this.zone, "title", "");
    this.follower = _get(this.zone, "follower", {});
  }

  onSelected(user) {
    this.follower = pick(user, ["id", "openid", "nickname", "avatar"]);
  }

  onDelete() {
    this.id = _get(this.zone, "_id");
    if (isEmpty(this.id)) {
      this.$router.go(-1);
      return;
    }
    this.deleteEntity({
      res: {
        id: this.id,
      },
      success: () => {
        this.$bus.$emit("map:zone:refresh");
        this.$nextTick(() => {
          this.$router.go(-1);
        });
      },
    });
  }

  submit() {
    this.id = _get(this.zone, "_id");

    const zone = merge(this.zone, {
      cover: this.cover,
      title: this.title,
      follower: this.follower,
    });
    delete zone._id;
    let res: any = {};
    if (this.id) {
      res.id = this.id;
      res.query = {};
      res.update = zone;
    } else {
      res.docs = zone;
    }

    this.saveEntity({
      res: res,
      success: () => {
        this.zone = null;
        this.showDialog = false;
        this.$bus.$emit("map:zone:refresh");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.zone-add-entry {
  width: 50px;
  height: 50px;

  font-size: 12px;
  font-weight: 600;
  text-align: center;

  .editing {
    background: #ff4500;
    color: #fff;
  }
}
.dialog {
  .title {
    padding-left: 10px;
  }
  & ::v-deep .h-dialog__mask {
    z-index: 10000;
  }
  & ::v-deep .h-dialog__dialog {
    z-index: 10001;
  }
}
</style>
