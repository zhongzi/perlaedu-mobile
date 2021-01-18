<template>
  <div class="wrapper photo-detail">
    <template v-if="media">
      <div class="photo">
        <photo :photo="media" :enabledClickToDetail="false" />
      </div>
      <ai-card>
        <div class="author">
          <img class="avatar" v-if="avatar" :src="avatar" />
          <div class="aname" v-if="aname" @click="gotoAlbum">{{ aname }}</div>
          <div class="merchant" v-if="merchantName">
            来自学校 {{ merchantName }}
          </div>
          <div class="published">
            创作于 {{ media.published_at | defaultDay }}
          </div>
        </div>

        <div class="info">
          <div class="title">{{ media.title }}</div>
          <div class="description">{{ media.description }}</div>
        </div>
      </ai-card>
      <ai-card class="section">
        <div class="interaction">
          <ai-button-round @click.native="saveStarAction" class="action">
            点赞
          </ai-button-round>
          <div class="detail">
            <ai-list-stored
              resource="mediaInteraction"
              scrollType=""
              :refresh.sync="refreshStarList"
              :query="query"
              :limit="50"
              @emit-list="(v) => (countInteractions = v.total)"
            >
              <template v-slot:item="{ item }">
                <img :src="item | safe('user.avatar')" class="avatar" />
              </template>
            </ai-list-stored>
          </div>
          <div class="count">{{ countInteractions }} 人次点赞</div>
        </div>
      </ai-card>
      <ai-card class="section">
        <div class="replies">
          <div class="label">精彩留言</div>
          <ai-list-stored
            resource="mediaInteraction"
            scrollHeight="40vh"
            :refresh.sync="refreshReplyList"
            :query="replyQuery"
          >
            <template v-slot:item="{ item }">
              <ai-cell
                class="reply"
                :cover="item | safe('user.avatar')"
                :title="item | safe('user.nickname')"
                :subtitle="item.created_at | defaultDate"
              >
                <template v-slot:right>
                  <span class="created">
                    {{ item | safe("description") }}
                  </span>
                  <!--
                  <i class="iconfont icon-dianzan" />
                  <span> {{ item | safe("count_star", 0) }} </span>
-->
                </template>
              </ai-cell>
            </template>
          </ai-list-stored>
          <ai-fixed-footer>
            <div class="footer">
              <ai-input
                class="input"
                v-model="description"
                placeholder="说点什么..."
              />
              <ai-button-round class="submit" @click.native="saveReplyAction">
                发送</ai-button-round
              >
              <i
                class="iconfont icon-share"
                @click="$bus.$emit('config:share:tip:show')"
              />
            </div>
          </ai-fixed-footer>
        </div>
      </ai-card>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiLine from "@/view/component/AiLine.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiButtonRound from "@/view/component/AiButtonRound.vue";
import AiCell from "@/view/component/AiCell.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import Photo from "./component/Photo.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiLine,
    AiCard,
    AiButtonRound,
    AiCell,
    AiInput,
    AiListStored,
    AiFixedFooter,
    Photo,
  },
})
export default class Home extends Mixins(SyncMixin) {
  avatar: string = null;
  aname: string = null;
  merchantName: string = null;

  countInteractions = 0;
  refreshStarList = false;
  description = "";
  refreshReplyList = false;

  media: any = null;
  link: any = null;

  get query() {
    return {
      media_id: this.media.id,
      type: "star",
      extras: JSON.stringify({
        MediaInteraction: ["user"],
        OAuth: ["avatar"],
      }),
    };
  }

  get replyQuery() {
    return {
      media_id: this.media.id,
      type: "reply",
      extras: JSON.stringify({
        MediaInteraction: ["user"],
        OAuth: ["avatar"],
      }),
    };
  }

  created() {
    this.load();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.load();
  }

  load() {
    this.loadMedia();
    this.loadLink();
  }

  loadMedia() {
    const id = parseInt(this.$route.params.mediaId);
    if (!id) return;

    this.loadEntity({
      store: "media",
      id: id,
      query: {
        extras: JSON.stringify({
          Media: ["file", "frame", "url", "merchant"],
        }),
      },
      success: (resp) => {
        this.media = cloneDeep(resp.data);

        this.$nextTick(() => {
          this.resetAuthor();
        });
      },
    });
  }

  loadLink() {
    const id = parseInt(this.$route.query.linkId as any);
    if (!id) return;

    this.loadEntity({
      store: "mediaLink",
      id: id,
      query: {
        extras: JSON.stringify({
          MediaLink: ["media", "target", "merchant"],
          Media: ["file", "frame", "url"],
          MediaAlbum: ["avatar"],
          Person: ["avatar_url"],
        }),
      },
      success: (resp) => {
        this.link = cloneDeep(resp.data);

        this.$nextTick(() => {
          this.resetAuthor();
        });
      },
    });
  }

  resetAuthor() {
    this.avatar = null;
    this.aname = null;
    this.merchantName =
      _get(this.link, "merchant.name") || _get(this.media, "merchant.name");

    if (!isEmpty(this.link)) {
      if (this.link.target_class === "Person") {
        this.avatar = _get(this.link, "target.avatar_url");
        this.aname = _get(this.link, "target.realname");
      } else if (this.link.target_class === "Group") {
        this.aname = _get(this.link, "target.name");
      } else {
        this.avatar = _get(this.link, "target.cover");
        this.aname = _get(this.link, "target.title");
      }
    }

    this.share();
  }

  saveStarAction() {
    this.saveEntity({
      store: "mediaInteraction",
      res: {
        media_id: this.media.id,
        type: "star",
      },
      success: () => {
        this.$hui.toast.info("点赞成功");
        this.refreshStarList = true;
      },
    });
  }

  saveReplyAction() {
    if (isEmpty(this.description)) {
      this.$hui.toast.info("评论不可为空");
      return;
    }

    this.saveEntity({
      store: "mediaInteraction",
      res: {
        media_id: this.media.id,
        type_: "reply",
        description: this.description,
      },
      success: () => {
        this.$hui.toast.info("评论成功");
        this.description = "";
        this.refreshReplyList = true;
      },
    });
  }

  gotoAlbum() {
    if (isEmpty(this.link)) return;

    this.$router.push({
      name: "mediaAlbum",
      params: {
        albumId: this.link.target_id,
      },
      query: {
        type: this.$route.query.type || this.link.target_class,
      },
    });
  }

  share() {
    if (isEmpty(this.media)) return;

    this.$bus.$emit("config:share", {
      title: this.media.title,
      desc: this.media.description,
      imgUrl: this.media.url,
    });
  }
}
</script>
<style lang="scss" scoped>
.photo-detail {
  padding: 10px;

  .author {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;

    font-size: 13px;
    line-height: 1.2;

    .avatar {
      width: 60px;
      border-radius: 50%;
    }
    .aname {
      font-size: 15px;
      font-weight: 800;
      line-height: 2;
    }
    .published {
      color: #a9a6a6;
    }
  }

  .info {
    margin: 10px auto;
    padding: 10px;
    text-align: center;

    .title {
      font-size: 18px;
      font-weight: 800;
      line-height: 2;
    }
    .description {
      font-size: 14px;
      line-height: 1.2;
    }
  }
  .section {
    margin: 5px 0px;
  }
  .interaction {
    display: flex;
    flex-direction: column;
    padding: 10px;

    .action {
      width: 30%;
      margin: 0px auto;

      background: linear-gradient(133deg, #ff7c30 0%, #ff6452 100%);
      opacity: 0.83;

      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 17px;

      border: none;
    }
    .count {
      text-align: right;
      font-size: 14px;
      font-weight: 700;
    }
    .detail {
      margin: 20px;

      .avatar {
        width: 40px;
        border-radius: 50%;
      }
    }
  }
  .replies {
    padding: 10px;

    .label {
      font-size: 14px;
      font-weight: 700;
      line-height: 3;
    }
    .reply {
      width: 100%;
      & ::v-deep .ai-cell__left-cover {
        width: 30px;
        border-radius: 50%;
        overflow: hidden;
      }

      .created {
        font-size: 13px;
      }
    }
  }
}
.footer {
  background: #fff;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .submit {
    width: 50px;
    height: 40px;
    min-height: 40px;
  }
  .input {
    flex: 1;
  }

  i {
    font-size: 32px;
    color: #ff7c30;
    margin: 0px 10px;
  }
}
</style>
