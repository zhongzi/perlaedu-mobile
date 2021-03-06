<template>
  <div class="wrapper photo-detail">
    <template v-if="media">
      <merchant-cell
        v-if="hasMerchant"
        class="section merchant"
        :merchant="media.merchant"
      />
      <div class="photo">
        <photo
          :photo="media"
          :enabledClickToDetail="false"
          :showMerged="true"
        />
      </div>
      <div class="container">
        <div class="section">
          <div class="info">
            <div class="title">{{ media.title }}</div>
            <div class="description">{{ media.description }}</div>
          </div>
          <div class="author">
            <div class="published">
              创作于 {{ media.published_at | defaultDay }}
            </div>
            <span>
              <i
                v-if="isEdiable"
                class="iconfont icon-editing"
                @click="gotoEditing"
              />
              <i
                class="iconfont icon-share"
                @click="$bus.$emit('show:share:popup')"
              />
            </span>
          </div>
        </div>
        <div class="section">
          <div class="stars">
            <ai-button-round @click.native="saveStarAction" class="star-action">
              点赞 <i class="iconfont icon-dianzan" />
            </ai-button-round>
            <ai-list-stored
              class="stars-list"
              resource="mediaInteraction"
              scrollType=""
              :limit="24"
              :refresh.sync="refreshStarList"
              :query="starQuery"
              @emit-list="(v) => (countStar = v.total)"
            >
              <template v-slot:header>
                <div class="label">{{ countStar }} 人点赞</div>
              </template>
              <template v-slot:item="{ item }">
                <div class="avatar">
                  <img :src="item | safe('user.avatar')" />
                </div>
              </template>
            </ai-list-stored>
          </div>
        </div>
        <div>
          <div class="replies">
            <div class="action">
              <ai-input
                class="input"
                v-model="description"
                placeholder="写下你的留言"
                @submit="saveReplyAction"
              />
              <ai-button-round @click.native="saveReplyAction">
                发送
              </ai-button-round>
            </div>
            <div class="label" v-if="countReply > 0">精彩留言</div>
            <ai-list-stored
              resource="mediaInteraction"
              scrollType=""
              :enableMoreData="true"
              :refresh.sync="refreshReplyList"
              :query="replyQuery"
              @emit-list="(v) => (countReply = v.total)"
            >
              <template v-slot:item="{ item }">
                <div class="reply">
                  <div class="reply-left">
                    <img :src="item | safe('user.avatar')" />
                  </div>
                  <div class="reply-right">
                    <div class="title">
                      <span> {{ item | safe("user.nickname") }} </span>
                      <span
                        v-if="checkReplyDeletable(item)"
                        @click="deleteReply(item)"
                      >
                        删除</span
                      >
                    </div>
                    <div class="subtitle">
                      {{ item | safe("description") }}
                    </div>
                  </div>
                </div>
              </template>
            </ai-list-stored>
          </div>
        </div>
      </div>
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

import { PersonRole } from "@/enum/person_role";

import MerchantCell from "@/view/website/component/MerchantCell.vue";
import Photo from "./component/Photo.vue";
import { getPosterData, checkEditable } from "./component/util";

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
    MerchantCell,
    Photo,
  },
})
export default class Home extends Mixins(SyncMixin) {
  aname: string = null;
  merchantName: string = null;

  countStar = 0;
  countReply = 0;
  refreshStarList = false;
  description = "";
  refreshReplyList = false;

  isEdiable = false;

  media: any = null;
  link: any = null;

  get starQuery() {
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

  get hasMerchant() {
    return _get(this.media, "merchant_id", 0) > 0;
  }

  created() {
    this.load();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.load();
  }

  @Watch("media", { deep: true })
  onMediaChanged() {
    this.checkEditable();
  }

  checkEditable() {
    this.isEdiable = checkEditable(
      this.$auth.user,
      _get(this.media, "merchant_id")
    );
    return;
  }

  gotoEditing() {
    if (!this.isEdiable) return;

    this.$router.push({
      name: "mediaPhotoEditing",
      params: {
        mediaId: this.media.id,
      },
    });
  }

  gotoWebsiteSchool() {
    this.$router.push({
      name: "websiteMerchant",
      params: {
        merchantId: this.media.merchant_id,
      },
    });
  }

  gotoAlbum() {
    if (!this.isEdiable || isEmpty(this.link)) return;

    let type = this.link.target_class.toLowerCase();
    if (
      this.link.target_class === "MediaAlbum" &&
      this.link.target.type === "course"
    ) {
      type = "course";
    } else if (this.link.target_class === "Person") {
      if ((this.link.target.role & PersonRole.student.value) > 0) {
        type = "student";
      } else {
        type = "teacher";
      }
    }

    this.$router.push({
      name: "mediaAlbum",
      params: {
        albumId: this.link.target_id,
      },
      query: {
        type: type,
      },
    });
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
          Merchant: ["count_persons"],
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
          MediaLink: ["media", "target", "merchant", "cover"],
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
    this.aname = _get(this.media, "title");
    this.merchantName =
      _get(this.link, "merchant.name") || _get(this.media, "merchant.name");

    if (!isEmpty(this.link)) {
      if (this.link.target_class === "Person") {
        this.aname = _get(this.link, "target.realname");
      } else if (this.link.target_class === "Group") {
        this.aname = _get(this.link, "target.name");
      } else {
        this.aname = _get(this.link, "target.title");
      }
    }

    this.share();
    this.configPoster();
  }

  checkReplyDeletable(reply) {
    return this.isEdiable || reply.openid === _get(this.$auth, "user.openid");
  }

  deleteReply(reply) {
    this.$hui.confirm.show({
      title: "删除确认",
      message: "确认删除当前留言?",
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.deleteEntity({
          store: "mediaInteraction",
          id: reply.id,
          success: () => {
            this.$hui.toast.info("删除成功");
            this.refreshReplyList = true;
          },
        });
      },
      onCancel: () => {},
    });
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

  share() {
    if (isEmpty(this.media)) return;

    let title = "我的最新力作，快来为我点赞吧!";
    if (!isEmpty(this.media.title)) {
      title = `【${this.media.title}】` + title;
    }
    this.$bus.$emit("config:share", {
      title: title,
      desc: this.media.description,
      imgUrl: this.media.url,
    });
  }

  configPoster() {
    if (isEmpty(this.media)) return;

    const person =
      _get(this.link, "target_class") === "Person" && _get(this.link, "target");
    const isNoTitle = isEmpty(this.media.title);
    const title = isNoTitle ? _get(person, "realname", "") : this.media.title;
    const subTitle =
      (!isNoTitle && person ? person.realname + " @ " : "") + this.merchantName;
    const description = this.media.description;
    const publishedAt = this.$options.filters.defaultDay(
      this.media.published_at
    );

    this.$bus.$emit(
      "config:poster",
      getPosterData(
        this.media,
        null,
        {
          title: title,
          subTitle: subTitle,
          description: description,
          publishedAt: publishedAt,
        },
        1000
      )
    );
  }
}
</script>
<style lang="scss" scoped>
.photo-detail {
  margin-bottom: 30px;

  .editing {
    position: fixed;
    top: 30px;
    right: 10px;
    z-index: 700;

    i {
      line-height: 30px;

      font-size: 28px;
      color: rgba(255, 255, 255, 0.91);
      padding: 7px;
      margin: 5px auto;
      background: #ff940f;
      border-radius: 10px;
    }
  }

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

    span {
      margin: 10px;
      i {
        font-size: 24px;
        margin: 10px;
      }
    }
  }

  .info {
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
  .container {
    padding: 0px 20px;
  }
  .section {
    margin: 5px 10px;
  }

  .merchant {
    background: initial;
    box-shadow: none;
    borde-radius: none;
  }

  .star-action {
    display: block;
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
    min-height: 40px;
  }

  .stars {
    display: flex;
    flex-direction: column;
    padding: 10px;

    .label {
      font-size: 14px;
      font-weight: 700;
      line-height: 1;
      text-align: center;
      color: #9a9b9e;
      margin-bottom: 5px;
    }

    .stars-list {
      margin: 20px 10px;

      & ::v-deep .ai-list-stored__list {
        display: grid;
        grid-template-columns: repeat(8, auto);
        justify-content: center;
      }
      .avatar {
        padding: 3px;

        img {
          width: 25px;
          border-radius: 4px;
        }
      }
    }
  }
  .replies {
    & ::v-deep .ai-list-stored__list-load-more {
      background: initial;
    }

    .action {
      display: flex;
      align-items: center;
      justify-content: space-between;

      button {
        width: auto;
        border: none;
        min-height: 40px;
        margin-left: 10px;
      }
    }

    .input {
      background: #fff;
      padding: 10px;
      flex: 1;
    }
    .label {
      font-size: 14px;
      font-weight: 700;
      line-height: 3;
    }
    .reply {
      display: flex;
      margin-bottom: 10px;
      width: 100%;

      &-left {
        width: 30px;
        margin-right: 10px;

        img {
          width: 100%;
          display: block;
          border-radius: 4px;
        }
      }
      &-right {
        display: flex;
        flex-direction: column;
        flex: 1;

        .title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #797878;

          span:nth-child(2) {
            color: #06288c;
          }
        }
        .subtitle {
          font-size: 14px;
          line-height: 1.2;
        }
      }
    }
  }
}
</style>
