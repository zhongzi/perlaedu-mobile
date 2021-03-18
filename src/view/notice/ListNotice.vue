<template>
  <div class="wrapper list-notice">
    <template v-if="query">
      <notices :query="query" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import Notices from "./component/Notices.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    Notices,
  },
})
export default class Home extends Mixins(SyncMixin) {
  myPersons: any = null;

  get personId() {
    return parseInt(this.$route.query.person as string);
  }

  get course() {
    const course = this.$route.query.tag;
    return isEmpty(course) ? null : course;
  }

  get groupId() {
    return parseInt(this.$route.query.group as string);
  }

  get noticeId() {
    return parseInt(this.$route.query.noticeId as string);
  }

  get query() {
    const query: any = {};
    if (this.noticeId) {
      query.id = this.noticeId;
    } else if (this.personId) {
      query["NoticeTarget.target_id"] = this.personId;
      query["NoticeTarget.target_class"] = "Person";
    } else if (this.course) {
      query["NoticeTarget.target_id"] = 0;
      query["NoticeTarget.target_class"] = this.course;
    } else if (this.groupId) {
      query["NoticeTarget.target_id"] = this.groupId;
      query["NoticeTarget.target_class"] = "Group";
    } else {
      query["required_by_user"] = true;
    }
    return query;
  }

  created() {
    // this.loadMyPersons();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    // this.loadMyPersons();
  }

  loadMyPersons() {
    if (!this.personId && !this.tag && !this.groupId) {
      const openid = this.$auth.user.openid as string;
      this.loadList({
        store: "person",
        query: {
          filters: JSON.stringify({
            openid: [openid],
            openid_second: [openid],
          }),
        },
        success: (resp) => {
          this.myPersons = resp.data.data;
        },
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.list-notice {
  background: #fff;
}
</style>
