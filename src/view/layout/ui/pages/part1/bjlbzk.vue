<template>
  <section class="container">
    <div class="bjlb">
      <div class="hd">
        <class-picker></class-picker>

        <div class="trigger"></div>
      </div>

      <!-- Str 日期选择 -->
      <div class="calendar-list">
        <div class="calendar-item">
          <div class="item-hd">
            <div class="ico"></div> 23
          </div>
          <div class="item-bd">
            <div class="month">10月</div>
            <div class="date">23日</div>
          </div>
        </div>
      </div>
      <!-- End 日期选择 -->

      <div class="class-list">
        <div class="class-item">
          <div class="name">
            <div class="count">
              <div class="ico"></div>3
            </div>
            <div class="txt">峨眉一期</div>
            <div class="arrow-bot"></div>
          </div>

          <div class="info">
            <div class="row">
              <div class="col">
                <div class="ico"></div> 真武七截阵
              </div>
              <div class="col">
                <div class="ico"></div> 张真人
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="ico"></div> 周日 13:05 周一15:30 周二15:30 周三15:30
              </div>
            </div>
          </div>

          <div class="content">
            <div class="btns">
              <div class="btn">
                <div class="ico"></div> 课程点名
              </div>
              <div class="btn">
                <div class="ico"></div> 发消息
              </div>
            </div>

            <div class="class-user-list">
              <div class="item">
                <div class="avatar"></div>
                <div class="name"></div>
              </div>
            </div>

            <div class="handle">
              <div class="handle-item">
                <div class="ico xiugai"></div> 修改
              </div>
              <div class="handle-item">
                <div class="ico lishi"></div> 历史
              </div>
              <div class="handle-item">
                <div class="ico songjifen"></div> 送积分
              </div>
              <div class="handle-item">
                <div class="ico rizhi"></div> 日志
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FilterItem from "~/components/FilterItem.vue";
import ClassPicker from "~/components/ClassPicker.vue";

export default {
  components: {
    /** 表单数据 */
    "filter-item": FilterItem,
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
