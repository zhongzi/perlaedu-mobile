<template>
  <section class="container ai-background">
    <div class="wdxs">
      <div class="hd">
        <class-picker text="新东方烹饪学校"></class-picker>

        <div class="name-picker">
          <div class="avatar">
            <div class="ico">
              <span class="iconfont iconbangding"></span>
            </div>
          </div>
          <div class="text">张翠山</div>
          <div class="arrow"></div>
        </div>
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

            <div class="calendar-item">
              <div class="item-hd">
                23
              </div>
              <div class="item-bd">
                <div class="month">10月</div>
                <div class="date">23日</div>
              </div>
            </div>

            <div class="calendar-item">
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

      <div class="bd">
        <div class="cont">
          <!-- Str 学生列表 -->
          <div class="student-list">
            <div class="list-title">
              <div class="txt">学生（5）</div>
              <div class="trigger">＋</div>
            </div>

            <div class="list-content">
              <cube-scroll>
                <div class="list-item">
                  <student-item status="bind"></student-item>
                </div>
                <div class="list-item">
                  <student-item :active="true"></student-item>
                </div>
                <div
                  class="list-item"
                  v-for="(item, index) in [1,1,1,1,1,1,1,1,1,1]"
                  :key="index"
                >
                  <student-item></student-item>
                </div>
              </cube-scroll>
            </div>
          </div>
          <!-- End 学生列表 -->

          <!-- Str 排课区域 -->
          <div class="arrange">
            <div class="arrange-btn">给张翠山排课</div>

            <div class="step-list">
              <cube-scroll>
                <div
                  class="step-item"
                  v-for="(item, index) in [1,1,1,1,1,1,1,1,1,1]"
                  :key="index"
                >
                  <div class="date-area">
                    <div class="time-1">10:30</div>
                    <div class="time-2">
                      <div class="ico"></div> 上午
                    </div>

                    <div class="progress">
                      <div class="circle"></div>
                      <div class="line">
                        <div class="line-part"></div>
                        <div class="line-part"></div>
                        <div class="line-part"></div>
                        <div class="line-part"></div>
                      </div>
                    </div>
                  </div>
                  <div class="arrange-info">
                    <user-item></user-item>
                  </div>
                </div>
                <div class="step-item">
                  <div class="date-area">
                    <div class="time-1">10:30</div>
                    <div class="time-2">
                      <div class="ico"></div> 上午
                    </div>

                    <div class="progress">
                      <div class="circle"></div>
                      <div class="line">
                        <div class="line-part"></div>
                        <div class="line-part"></div>
                        <div class="line-part"></div>
                        <div class="line-part"></div>
                      </div>
                    </div>
                  </div>
                  <div class="arrange-info">
                    <user-item></user-item>
                  </div>
                </div>
              </cube-scroll>
            </div>
          </div>
          <!-- End 排课区域 -->
        </div>

        <!-- Str 教师信息 -->
        <div class="teacher-info">
          <div class="detail">
            <div class="avatar"></div>

            <div class="name">张翠山</div>

            <div class="phone">
              <span class="iconfont iconshoujihao"></span> 13908888888
            </div>

            <div class="btn">
              <span class="iconfont iconfaxinxi"></span> 发消息
            </div>

            <div class="btn">
              更多详情
            </div>
          </div>

          <div class="history">
            <div class="tab-bar">
              <div class="tab-item active">课时</div>
              <div class="tab-item">储值卡</div>
              <div class="tab-item">积分</div>
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
                <cube-scroll>
                  <div class="num">+ 10</div>
                  <div class="date">1小时前 11:00:5</div>
                  <div class="num">+ 10</div>
                  <div class="date">1小时前 11:00:51小时前</div>
                  <div class="num">+ 10</div>
                </cube-scroll>
              </div>
              <div class="pm-item m-item">
                <cube-scroll>
                  <div class="num">- 10</div>
                  <div class="date">1小时前 11:00:5</div>
                  <div class="num">- 10</div>
                  <div class="date">1小时前 11:00:51小时前</div>
                  <div class="num">- 10</div>
                  <div class="date">1小时前 11:00:51小时前</div>
                  <div class="num">- 10</div>
                  <div class="date">1小时前 11:00:51小时前</div>
                  <div class="num">- 10</div>
                  <div class="date">1小时前 11:00:51小时前</div>
                  <div class="num">- 10</div>
                </cube-scroll>
              </div>
            </div>

            <div class="btn-area">
              <div class="btn plus">+ 加课时</div>
              <div class="btn minus">- 减课时</div>
            </div>
          </div>
        </div>
        <!-- End 教师信息 -->
      </div>
    </div>
  </section>
</template>

<script>
import ClassPicker from "~/components/ClassPicker.vue";
import StudentItem from "~/components/StudentItem3.vue";
import UserItem from "~/components/UserItem3.vue";

export default {
  components: {
    /** 班级选择 */
    "class-picker": ClassPicker,
    /** 学生 */
    "student-item": StudentItem,
    /** 人员 */
    "user-item": UserItem
  },

  data() {
    return {};
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
