<template>
  <ai-card class="wrapper album-cell" @click.native="gotoAlbum">
    <template v-slot:body>
      <div class="body">
        <img :src="albumCover" v-if="albumCover" />
      </div>
    </template>
    <template v-slot:footer>
      <div class="footer">
        <div class="merchant" @click.stop="gotoWebsite">
          <img :src="person | safe('merchant.logo_url')" />
          <span> {{ person | safe("merchant.name") }} </span>
        </div>
        <div class="person">{{ realname }} ({{ listTotal }}张)</div>
      </div>
    </template>
  </ai-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiLine from "@/view/component/AiLine.vue";
import AiCard from "@/view/component/AiCard.vue";

import { TagType, CardType } from "@/enum/tag";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiLine,
    AiCard,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: () => ({}) }) person: any;

  get realname() {
    return _get(this.person, "realname");
  }

  get albumCover() {
    return _get(this.list, "[0].cover");
  }

  created() {
    this.store = "mediaLink";
    this.load();
  }

  load() {
    this.loadList({
      query: {
        include_count: true,
        target_id: this.person.id,
        target_class: "Person",
        sort: "is_cover desc,id desc",
        extras: "cover",
      },
    });
  }

  gotoWebsite() {
    if (_get(this.person, "merchant.website")) {
      this.$router.push({
        name: "websiteMerchant",
        params: {
          merchantId: this.person.merchant_id,
        },
      });
    }
  }

  gotoAlbum() {
    if (!isEmpty(this.person) && this.listTotal > 0) {
      this.$router.push({
        name: "mediaAlbum",
        params: {
          albumId: this.person.id,
        },
        query: {
          type: "student",
        },
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.album-cell {
  margin: 10px 20px;
  padding: 10px;

  .body {
    height: 100px;
    background: #d8d8d830;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;

    .merchant {
      display: flex;
      align-items: center;

      img {
        display: block;
        width: 20px;
        border-radius: 8px;
        margin-right: 10px;
      }
      span {
        font-size: 12px;
        color: #928e8e;
      }
    }
    .person {
      font-size: 12px;
    }
  }
}
</style>
