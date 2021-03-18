<template>
  <ai-card class="wrapper notice-cell">
    <template v-slot:header>
      <div class="header">
        <span> 类型: {{ templateName }} </span>
        <div class="creator">
          <span v-if="sentAt"> 发送时间: {{ sentAt | defaultDate }} </span>
          <span v-else> 创建时间: {{ createdAt | defaultDate }} </span>
          <ai-avatar :avatar="avatar" class="avatar" />
        </div>
      </div>
    </template>
    <template v-slot:body>
      <ai-cell class="body">
        <template v-slot:cover>
          <div class="logo" @click="openDetail">
            <img
              v-if="cover"
              :src="cover | alioss({ width: 128 })"
              class="cover"
            />
            <i v-else class="iconfont icon-notice" />
          </div>
        </template>
        <template v-slot:title>
          <span @click="openDetail" style="line-height: 2">{{ title }} </span>
        </template>
        <template v-slot:remark>
          <template v-for="(tag, index) in tags">
            <ai-badge :content="tag.content" :color="tag.color" :key="index" />
          </template>
        </template>
        <template v-slot:subtitle>
          <div class="remark">
            <div class="progress" v-if="sendProgress">
              发送进度: {{ sendProgress }}
            </div>
            <div class="progress" v-if="readProgress">
              已查看: {{ readProgress }}
            </div>
            <div class="prev-time" v-if="prevTime">
              上次时间: {{ prevTime | defaultDate }}
            </div>
            <div class="next-time" v-if="nextTime">
              下次时间: {{ nextTime | defaultDate }}
            </div>
            <div class="next-time" v-if="isDelayNotice">
              设定时间: {{ delayTime | defaultDate }}
              <span v-if="isDelayExpired"> (已过期) </span>
            </div>
          </div>
        </template>
        <template v-slot:right>
          <div class="actions">
            <ai-button class="action" v-if="isPending" @click.native="openEdit">
              编辑
            </ai-button>
            <ai-button
              class="action"
              v-if="isPending"
              @click.native="updateNotice({ status: 'running' })"
            >
              启动
            </ai-button>
            <ai-button
              class="action"
              v-if="isCronNotice && isRunning"
              @click.native="updateNotice({ status: 'stopped' })"
            >
              停止
            </ai-button>
            <ai-button
              class="action"
              v-if="!isRunning"
              @click.native="deleteNotice"
            >
              删除</ai-button
            >
            <ai-button class="action" v-if="link" @click.native="openLink">
              打开外链
            </ai-button>
          </div>
        </template>
      </ai-cell>
    </template>
  </ai-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButton from "@/view/component/AiButton.vue";
import AiCell from "@/view/component/AiCell.vue";
import AiBadge from "@/view/component/AiBadge.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiAvatar from "@/view/component/AiAvatar.vue";

import { NoticeStatus, NoticeChannel } from "@/enum/notice";

import _get from "lodash/get";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiButton,
    AiCell,
    AiCard,
    AiBadge,
    AiAvatar,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) notice: any;

  get isPending() {
    return this.status === NoticeStatus.pending;
  }

  get isRunning() {
    return this.status === NoticeStatus.running;
  }

  get cover() {
    let cover = _get(this.notice, "cover");
    if (!isEmpty(cover)) return cover;

    cover = _get(this.notice, "template.cover");
    if (!isEmpty(cover)) return cover;
    return null;
  }

  get title() {
    let title = _get(this.notice, "title");
    if (!isEmpty(title)) return title;

    title = _get(this.notice, "template.title");
    if (!isEmpty(title)) return title;
    return null;
  }

  get link() {
    const link = _get(this.notice, "link");
    return !isEmpty(link) && link;
  }

  get templateName() {
    return _get(this.notice, "template.title");
  }

  get avatar() {
    return _get(this.notice, "user.avatar");
  }

  get createdAt() {
    return _get(this.notice, "created_at");
  }

  get sentAt() {
    return _get(this.notice, "sent_at");
  }

  get status() {
    return NoticeStatus[_get(this.notice, "status")];
  }

  get channel() {
    return NoticeChannel[_get(this.notice, "channel")];
  }

  get sendProgress() {
    const count = _get(this.notice, "statistics.notice_recipient.count", 0);
    if (count <= 0) return null;

    const countSent = _get(
      this.notice,
      "statistics.notice_recipient.count_sent",
      0
    );
    return ((countSent * 100) / count).toFixed(2);
  }

  get readProgress() {
    const count = _get(this.notice, "statistics.notice_recipient.count", 0);
    if (count <= 0) return null;

    const countReaded = _get(
      this.notice,
      "statistics.notice_recipient.count_readed",
      0
    );
    return ((countReaded * 100) / count).toFixed(2);
  }

  get isCronNotice() {
    return !isEmpty(_get(this.notice, "cron"));
  }

  get delayTime() {
    return _get(this.notice, "time");
  }

  get isDelayNotice() {
    return !isEmpty(this.delayTime);
  }

  get isDelayExpired() {
    if (!this.isDelayNotice) return;

    return this.$options.filters.isPast(this.delayTime);
  }

  get nextTime() {
    if (!this.isCronNotice) return null;

    return _get(this.notice, "next_time");
  }

  get prevTime() {
    if (!this.isCronNotice) return null;
    return _get(this.notice, "next_time");
  }

  get tags() {
    // 类型
    const tags: any = [];
    if (this.isCronNotice) {
      tags.push({
        content: "循环通知",
        color: "red",
      });
    } else if (this.isDelayNotice) {
      tags.push({
        content: "定时通知",
        color: "red",
      });
    } else {
      tags.push({
        content: "即时通知",
        color: "red",
      });
    }
    // status
    if (this.status) {
      tags.push({
        content: this.status.text,
        color: this.status.color,
      });
    }

    //channel
    tags.push({
      content: "站内信",
      color: "red",
    });
    if (this.channel && this.channel !== NoticeChannel.inbox) {
      tags.push({
        content: this.channel.text,
        color: this.channel.color,
      });
    }
    return tags;
  }

  openLink() {
    window.location.href = this.link;
  }

  openDetail() {
    this.$router.push({
      name: "noticeDetail",
      params: {
        noticeId: this.notice.id,
      },
    });
  }

  openEdit() {
    this.$router.push({
      name: "noticeEditing",
      params: {
        noticeId: this.notice.id,
      },
    });
  }

  updateNotice(changes) {
    this.saveEntity({
      store: "notice",
      id: this.notice.id,
      res: merge(
        {
          id: this.notice.id,
        },
        changes
      ),
      success: () => {
        this.$hui.toast.info("操作成功");
      },
      failure: (err) => {
        this.$hui.toast.error(err.response.data.message);
      },
    });
  }

  deleteNotice() {
    this.$hui.confirm.show({
      title: "删除确认",
      message: `您正在删除通知任务 < ${this.notice.title} >?，确认无误可点击确认按钮继续`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.deleteEntity({
          store: "notice",
          id: this.notice.id,
          success: () => {
            this.$hui.toast.info("操作成功");
            this.goBack();
          },
          failure: (err) => {
            this.$hui.toast.error(err.response.data.message);
          },
        });
      },
      onCancel: () => {},
    });
  }

  goBack() {
    if (this.$route.name === "noticeDetail") {
      this.$router.go(-1);
      return;
    }

    this.$emit("refresh");
  }
}
</script>
<style lang="scss" scoped>
.notice-cell {
  padding: 10px;
  margin: 10px auto;

  .header {
    width: 100%;

    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .creator {
      display: flex;
      align-items: center;
      justify-content: space-between;

      & ::v-deep .ai-cell__left {
        img {
          width: 20px;
        }
      }

      .avatar {
        min-height: auto;
      }
    }
  }
  .body {
    .logo {
      i {
        font-size: 40px;
      }
    }

    .remark {
      font-size: 12px;
    }

    .actions {
      display: flex;
      flex-direction: column;

      .action {
        height: auto;
        font-size: 12px;
        padding-top: 5px;
        padding-bottom: 5px;
        margin: 2px auto;
      }
    }
  }
}
</style>
