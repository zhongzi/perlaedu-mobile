<template>
  <section class="container ai-background">
    <div class="xsxq">
      <div class="tab-bar">
        <div
          :class="'tab-item ' + (item.active ? 'active' : '')"
          v-for="(item,index) in navList"
          :key="index"
          @click="actionChangeNav(item)"
        >{{item.text}}</div>
      </div>

      <div class="class-area">
        <div class="add-class">
          <span class="iconfont iconjiahao"></span>
        </div>
        <cube-scroll
          ref="scroll"
          :data="[1,1,1,1,1]"
          direction="horizontal"
          class="horizontal-scroll-list-wrap"
        >
          <div class="class-list">
            <div class="class-wrap">
              <div class="class-item active">
                九阳神功(26)
              </div>
              <div
                class="class-item"
                v-for="(item, index) in [1,1,1,1,1]"
                :key="index"
              >乾坤大挪移</div>
            </div>
          </div>
        </cube-scroll>
      </div>

      <div class="plus-minus">
        <div class="pm-item p-item">
          <div class="num">+ 10</div>
          <div class="date">1小时前 11:00:5</div>
          <div class="num">+ 10</div>
          <div class="date">1小时前 11:00:51小时前</div>
          <div class="num">+ 10</div>
        </div>
        <div class="pm-item m-item">
          <div class="num">- 10</div>
          <div class="date">1小时前 11:00:5</div>
          <div class="num">- 10</div>
          <div class="date">1小时前 11:00:5</div>
          <div class="num">- 10</div>
        </div>
      </div>

      <div class="btn-area">
        <div class="btn plus">+ 加课时</div>
        <div class="btn minus">- 减课时</div>
      </div>

      <div class="student-detail">
        <arrow-item
          type="avatar"
          label="头像"
          className="margin"
        ></arrow-item>
        <arrow-item
          label="姓名"
          value="大力金刚指"
          className="margin"
        ></arrow-item>
        <arrow-item
          label="电话"
          value="13908888888"
          className="margin"
        ></arrow-item>
        <arrow-item
          label="性别"
          value="女"
          className="margin"
        ></arrow-item>
        <arrow-item
          label="出生年月"
          className="margin"
        ></arrow-item>
        <arrow-item
          label="备注"
          className="margin"
        ></arrow-item>
        <arrow-item
          label="所学课程"
          className="active margin"
        >
          <arrow-item
            label="九阴白骨爪（33）"
            value="最后一次变动 2019-11-23 周四 "
          >
          </arrow-item>
        </arrow-item>
      </div>
    </div>
  </section>
</template>

<script>
import ArrowItem from "~/components/ArrowItem.vue";

export default {
  components: {
    /** 用户 */
    "arrow-item": ArrowItem
  },

  data() {
    return {
      navList: [
        {
          text: "课时",
          active: true
        },
        {
          text: "储值卡",
          active: false
        },
        {
          text: "积分",
          active: false
        }
      ]
    };
  },

  head() {
    return {
      title: "学生详情"
    };
  },

  methods: {
    /**
     * 切换导航栏
     */
    actionChangeNav(cur) {
      this.navList.map(item => {
        if (item.text === cur.text) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
</style>
