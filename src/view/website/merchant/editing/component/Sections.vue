<template>
  <div class="wrapper sections-manager" @click="open = true">
    <ai-cell>
      <template v-slot:title> 点击官网板块管理 </template>
      <template v-slot:subtitle> （可改名，可关闭，可排序） </template>
      <template v-slot:right>
        <i class="iconfont icon-bianji" />
      </template>
    </ai-cell>
    <ai-popup v-model="open">
      <div class="body">
        <div class="header">板块管理</div>
        <div class="sections">
          <template v-for="section in sections">
            <ai-cell class="section" :key="section.sid">
              <template v-slot:title>
                <ai-input-switchable
                  v-model="section.title"
                  tip=""
                  mode="unnormal"
                  class="title-editor"
                />
              </template>
              <template v-slot:subtitle> </template>
              <template v-slot:right>
                <div class="actions">
                  <ai-input-switch v-model="section.enabled" />
                  <i
                    class="iconfont icon-zhiding-top"
                    @click="updateSequence(section)"
                  />
                </div>
              </template>
            </ai-cell>
          </template>
        </div>
        <ai-fixed-footer>
          <ai-submit-actions
            deleteLabel="系统默认"
            @cancel="open = false"
            @submit="onSubmit"
            @deleted="resetDefaultSections"
          />
        </ai-fixed-footer>
      </div>
    </ai-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCell from "@/view/component/AiCell.vue";
import AiPopup from "@/view/component/AiPopup.vue";
import AiInputSwitch from "@/view/component/AiInputSwitch.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiInputSwitchable from "@/view/component/AiInputSwitchable.vue";

import _get from "lodash/get";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
import reverse from "lodash/reverse";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCell,
    AiPopup,
    AiInputSwitch,
    AiInputSwitchable,
    AiSubmitActions,
    AiFixedFooter,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  open: boolean = false;
  sections: any = null;
  defaultSections: any = [
    {
      sid: "campaign",
      title: "最新活动",
      enabled: true,
      sequence: 6,
    },
    {
      sid: "course",
      title: "热门课程",
      enabled: true,
      sequence: 5,
    },
    {
      sid: "teacher",
      title: "优秀老师",
      enabled: true,
      sequence: 4,
    },
    {
      sid: "album",
      title: "学校相册",
      enabled: true,
      sequence: 3,
    },
    {
      sid: "video",
      title: "精彩视频",
      enabled: true,
      sequence: 2,
    },
    {
      sid: "article",
      title: "学校动态",
      enabled: true,
      sequence: 1,
    },
  ];

  get settings() {
    return _get(this.merchant, "website.settings", {});
  }

  created() {
    this.store = "website";
    this.resetDefaultSections();
    this.resetSections();
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.resetSections();
  }

  resetSections() {
    const t = this.settings.sections;
    if (!isEmpty(t)) {
      this.sections = cloneDeep(t);
    }
  }

  resetDefaultSections() {
    this.sections = cloneDeep(this.defaultSections);
  }

  onSubmit() {
    this.id = _get(this.merchant, "website.id");
    if (!this.id) return;

    const changes = {
      settings: merge(cloneDeep(this.settings), { sections: this.sections }),
    };

    this.saveEntity({
      res: merge({ id: this.id }, changes),
      success: () => {
        this.$nextTick(() => {
          this.commitChanges(this.id, {
            website: merge(cloneDeep(this.merchant.website), changes),
          });
          this.open = false;
        });
      },
    });
  }

  updateSequence(section) {
    section.sequence = new Date().getTime();
    this.sections = reverse(sortBy(this.sections, "sequence"));
  }
}
</script>
<style lang="scss" scoped>
.sections-manager {
  margin: 10px 20px;
}

.body {
  padding: 15px;
  .header {
    display: inline-block;

    font-size: 16px;
    font-weight: 600;
    color: rgba(74, 74, 74, 1);
    line-height: 2;
    border-bottom: 5px solid #000;
  }

  .sections {
    .section {
      margin: 10px auto;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .title-editor ::v-deep .ai-input__label {
    flex-direction: row-reverse;
  }
}
</style>
