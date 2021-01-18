<template>
  <div class="user-item" style="border-top: none">
    <div class="detail">
      <div class="avatar">
        <img :src="person | safe('avatar_url')" />
      </div>
      <div class="info">
        <div class="name">
          {{ person | safe("realname") }}
          <i
            class="iconfont iconbangding"
            v-if="person.openid && person.openid.length > 0"
          />
          <i
            class="iconfont iconbangding"
            v-if="person.openid_second && person.openid_second.length > 0"
          />
        </div>
        <div class="status" v-if="person.status === 'freezing'">
          <span class="iconfont icontingke"></span> 已停课
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import CheckBox from "./CheckBox.vue";

@Component({
  components: {
    CheckBox,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) person: any;
  @Prop({ type: Boolean, default: false }) isMutiple: boolean;
  @Prop({ type: Boolean, default: false }) checked: boolean;
  @Prop({ type: Boolean, default: false }) uncheckable: boolean;

  curStudent: any = null;
  innerChecked: boolean = false;

  created() {
    !this.isMutiple &&
      this.$bus.$on("picker:person:changed", (person, isChecked) => {
        this.curStudent = isChecked ? person : null;
        if (this.curStudent !== this.person) {
          this.innerChecked = false;
        }
      });

    this.innerChecked = this.checked;
  }

  onInnerCheckedChanged(isChecked) {
    if (!this.isMutiple && this.innerChecked) return;

    this.innerChecked = isChecked;
    this.$bus.$emit("picker:person:changed", this.person, isChecked);
  }
}
</script>
<style lang="scss" scoped>
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 7.8rem;
  border-top: 0.1rem solid rgba(151, 151, 151, 0.15);

  .detail {
    display: flex;
    flex: 1;
    align-items: center;

    .avatar {
      display: block;
      flex: 0 0 4.5rem;
      height: 4.5rem;
      border-radius: 1rem;
      background-color: #ffd811;

      img {
        width: 100%;
        height: 100%;
        border-radius: 1rem;
      }
    }

    .info {
      flex: 1;
      padding-left: 1rem;

      .name {
        display: flex;
        align-items: center;
        color: #4a4a4a;
        font-size: 1.4rem;
        font-weight: bold;

        .iconfont {
          margin-left: 0.4rem;
          color: #f58723;
          font-size: 1.3rem;
        }
      }

      .status {
        display: flex;
        align-items: center;
        height: 2rem;
        color: #4a4a4a;
        font-size: 1.2rem;

        .iconfont {
          position: relative;
          bottom: -0.1rem;
          margin-right: 0.6rem;
          font-size: 1.4rem;
        }
      }
    }
  }

  .arrow {
    position: relative;
    top: -0.9rem;
    color: #d4d4d4;
    .iconfont {
      font-size: 1.3rem;
    }
  }
}
</style>
