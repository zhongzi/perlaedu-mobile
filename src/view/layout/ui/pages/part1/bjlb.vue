<template>
  <section class="container ai-background">
    <div class="bjlb">
      <div class="hd">
        <class-picker
          size="big"
          text="新东方烹饪学校"
        ></class-picker>

        <span class="iconfont iconlishi"></span>
      </div>

      <!-- Str 日期选择 -->
      <div class="calendar-list">
        <cube-scroll
          ref="scroll"
          direction="horizontal"
          class="horizontal-scroll-list-wrap"
        >
          <div class="calendar-wrap">
            <div class="calendar-item active">
              <div class="item-hd">
                23
              </div>
              <div class="item-bd">
                <div class="month"></div>
                <div class="date">周五</div>
              </div>
            </div>

            <div class="calendar-item">
              <div class="item-hd">
                23
              </div>
              <div class="item-bd">
                <div class="month"></div>
                <div class="date">23日</div>
              </div>
            </div>

            <div
              class="calendar-item"
              v-for="(item,index) in [1,1,1,1,1]"
              :key="index"
            >
              <div class="item-hd">
                23
              </div>
              <div class="item-bd">
                <div class="month">10月</div>
                <div class="date">23日</div>
              </div>
            </div>
          </div>
        </cube-scroll>
      </div>
      <!-- End 日期选择 -->

      <div class="class-list">
        <div class="class-item">
          <div class="name">
            <div class="count">
              <div class="ico">
                <span class="iconfont iconrenshu"></span>
              </div>
              <div class="text">3</div>
            </div>
            <div class="txt">峨眉一期</div>
            <div class="arrow-bot">
              <span class="iconfont iconjiantou"></span>
            </div>
          </div>

          <div class="info">
            <div class="row">
              <div class="col">
                <span class="iconfont iconkecheng"></span> 真武七截阵
              </div>
              <div class="col">
                <span class="iconfont iconlaoshi"></span> 张真人
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span class="iconfont iconriqi"></span> 周日 13:05 周一15:30 周二15:30 周三15:30
              </div>
            </div>
          </div>
        </div>
        <div class="class-item open">
          <div class="name">
            <div class="count">
              <div class="ico">
                <span class="iconfont iconrenshu"></span>
              </div>
              <div class="text">3</div>
            </div>
            <div class="txt">峨眉一期</div>
            <div class="arrow-bot">
              <span class="iconfont iconjiantou"></span>
            </div>
          </div>

          <div class="info">
            <div class="row">
              <div class="col">
                <span class="iconfont iconkecheng"></span> 真武七截阵
              </div>
              <div class="col">
                <span class="iconfont iconlaoshi"></span> 张真人
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span class="iconfont iconriqi"></span> 周日 13:05 周一15:30 周二15:30 周三15:30
              </div>
            </div>
          </div>

          <div class="student-area">
            <div class="btn-area">
              <div class="btn">
                <span class="iconfont iconkechengdianming"></span>课程点名
              </div>
              <div class="btn">
                <span class="iconfont iconfaxinxi"></span>发消息
              </div>
            </div>

            <div class="student-list">
              <div class="student-item">
                <student-item :isBind="true"></student-item>
              </div>
              <div class="student-item">
                <student-item></student-item>
              </div>
              <div class="student-item">
                <student-item></student-item>
              </div>
            </div>
          </div>

          <div class="handles">
            <div class="handle-item">
              <span class="iconfont iconxiugai"></span> 修改
            </div>
            <div class="handle-item">
              <span class="iconfont iconkechenglishi"></span> 历史
            </div>
            <div class="handle-item">
              <span class="iconfont iconsongjifen"></span> 送积分
            </div>
            <div class="handle-item">
              <span class="iconfont iconrizhi"></span> 日志
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import StudentItem from "~/components/StudentItem.vue";
import ClassPicker from "~/components/ClassPicker.vue";

export default {
  components: {
    /** 表单数据 */
    "student-item": StudentItem,
    /** 班级选择 */
    "class-picker": ClassPicker
  },

  data() {
    return {
      list: [
        {
          tag: "A",
          users: [
            {
              name: "全真弃子",
              binded: true,
              status: "已停课"
            }
          ]
        }
      ]
    };
  },

  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss">
</style>
