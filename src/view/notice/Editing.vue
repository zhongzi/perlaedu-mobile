<template>
  <div class="wrapper notice-edit">
    <ai-card class="section">
      <template v-slot:header>
        <div class="title">通知类型</div>
      </template>
      <template v-slot:body>
        <notice-templates v-model="template" :setFirstSelected="!!!noticeId" />
      </template>
    </ai-card>
    <ai-card class="section">
      <template v-slot:header>
        <div class="title">通知标题</div>
      </template>
      <template v-slot:body>
        <ai-input v-model="title" />
      </template>
    </ai-card>
    <ai-card class="section">
      <template v-slot:header>
        <div class="title">通知对象</div>
      </template>
      <template v-slot:body>
        <notice-targets v-model="targets" :isEditing="true" />
      </template>
    </ai-card>
    <ai-card class="section">
      <template v-slot:header>
        <div class="title">通知内容</div>
      </template>
      <template v-slot:body>
        <ai-content-media-editor
          kind="notice"
          :content.sync="description"
          :medias.sync="medias"
        />
      </template>
    </ai-card>
    <ai-card class="section">
      <template v-slot:header>
        <div class="title">通知外链</div>
      </template>
      <template v-slot:body>
        <ai-input v-model="link" />
      </template>
    </ai-card>
    <ai-card class="section">
      <template v-slot:header>
        <div class="title">通知渠道</div>
      </template>
      <template v-slot:body>
        <ai-selection-enum
          v-model="channel"
          :status="NoticeChannel"
          :enableAllOption="false"
        />
      </template>
    </ai-card>
    <ai-card class="section">
      <template v-slot:header>
        <div class="title">通知时间</div>
      </template>
      <template v-slot:body>
        <div class="types">
          <ai-input-radio
            :checked="type === 'none'"
            value="none"
            @change="(v) => (type = v)"
            title="实时"
          />
          <ai-input-radio
            value="schedule"
            :checked="type === 'schedule'"
            @change="(v) => (type = v)"
            title="定时"
          />
          <!--
          <ai-input-radio
            value="cron"
            :checked="type === 'cron'"
            @change="(v) => (type = v)"
            title="循环"
          />
-->
        </div>
        <template v-if="type === 'schedule'">
          <ai-input-datetime v-model="time" />
        </template>
        <!--
        <template v-if="type === 'cron'">
          <ai-input-cron v-model="cron" />
        </template>
-->
      </template>
    </ai-card>
    <ai-fixed-footer>
      <ai-submit-actions @cancel="goBack" @submit="onSubmit" />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiInput from "@/view/component/AiInput.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiSelectionEnum from "@/view/component/AiSelectionEnum.vue";
import AiInputDatetime from "@/view/component/AiInputDatetime.vue";
import AiInputCron from "@/view/component/AiInputCron.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiContentMediaEditor from "@/view/component/AiContentMediaEditor.vue";
import AiInputRadio from "@/view/component/AiInputRadio.vue";

import NoticeTemplates from "./component/admin/NoticeTemplates.vue";
import NoticeTargets from "./component/admin/NoticeTargets.vue";

import { NoticeChannel } from "@/enum/notice";

import _get from "lodash/get";
import map from "lodash/map";
import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

@Component({
  components: {
    AiCard,
    AiInput,
    AiInputDatetime,
    AiInputCron,
    AiFixedFooter,
    AiSubmitActions,
    AiContentMediaEditor,
    AiSelectionEnum,
    AiInputRadio,
    NoticeTemplates,
    NoticeTargets,
  },
})
export default class Home extends Mixins(SyncMixin) {
  NoticeChannel: any = NoticeChannel;

  template: any = null;
  targets: any = null;
  title: any = null;
  description: string = "";
  link: string = "";
  medias: any = [];
  channel: any = "";

  type: string = "none";
  cron: string = "";
  time: any = null;

  get noticeId() {
    return parseInt(this.$route.params.noticeId);
  }

  get notice() {
    return cloneDeep(this.entity);
  }

  created() {
    this.store = "notice";
    this.clone();
    this.load();
    this.reset();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.load();
  }

  @Watch("notice", { deep: true })
  onNoticeChanged() {
    this.reset();
  }

  @Watch("type", { deep: true })
  onTypeChanged() {
    if (this.type === "schedule" && isEmpty(this.time)) {
      this.time = new Date();
    }
  }

  @Watch("template")
  onTemplate(newVal, oldVal) {
    const requireReplace =
      isEmpty(this.title) || isEqual(this.title, oldVal && oldVal.title);
    this.title = requireReplace ? _get(this.template, "title", "") : this.title;
  }

  load() {
    if (!this.noticeId) return;

    this.id = this.noticeId;
    this.loadEntity({
      query: {
        extras: JSON.stringify({
          Notice: ["targets", "template", "attachments"],
          NoticeTarget: ["target"],
          MediaAttachment: ["media"],
          Media: ["url"],
        }),
      },
    });
  }

  clone() {
    const cloneid = this.$route.query.cloneid;
    if (isEmpty(cloneid)) return;

    this.saveEntity({
      store: "notice",
      res: {
        cloneid: cloneid,
      },
      success: (resp) => {
        this.$nextTick(() => {
          this.$router.push({
            name: this.$route.name,
            params: {
              noticeId: resp.data.id,
            },
          });
        });
      },
    });
  }

  reset() {
    if (isEmpty(this.notice)) return;

    this.template = this.notice.template;
    this.targets = this.notice.targets;
    this.title = this.notice.title;
    this.description = this.notice.description;
    this.medias = map(_get(this.notice, "attachments", []), (attachment) => {
      return attachment.media;
    });
    this.channel = this.notice.channel;
    this.cron = this.notice.cron;
    this.time = this.notice.time;

    if (!isEmpty(this.time)) {
      this.type = "schedule";
    }

    if (!isEmpty(this.cron)) {
      this.type = "cron";
    }
  }

  goBack() {
    this.$router.go(-1);
  }

  onSubmit() {
    if (isEmpty(this.targets)) {
      this.$hui.toast.error("通知对象不可为空");
      return;
    }

    if (isEmpty(this.description)) {
      this.$hui.toast.error("通知内容不可为空");
      return;
    }

    if (this.type !== "cron") this.cron = "";
    if (this.type !== "schedule") this.time = "";

    this.saveEntity({
      id: this.notice.id,
      store: "notice",
      res: {
        id: this.notice.id,
        title: this.title,
        description: this.description,
        template_id: this.template.id,
        channel: this.channel,
        link: this.link,
        cron: this.cron,
        time: this.time,
        targets: this.targets,
        medias: this.medias,
      },
      success: () => {
        this.$nextTick(() => {
          this.goBack();
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.notice-edit {
  padding: 10px;
  margin-bottom: 50px;

  .section {
    margin: 10px auto;
    padding: 10px;

    .title {
      width: 100%;
      font-size: 14px;
      font-weight: 800;
    }

    .types {
      display: flex;
      align-items: center;
      justify-content: space-around;

      margin-bottom: 10px;

      & ::v-deep .ai-title__title {
        font-size: 12px;
      }
    }
  }
}
</style>
