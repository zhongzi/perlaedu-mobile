<template>
  <section class="container ai-background">
    <div class="zuoye">
      <div class="hd">
        <div class="btn">交作业</div>
      </div>

      <div class="bd">
        <div class="nav">
          <div class="item">未批改</div>
          <div class="item active">已批改</div>
        </div>

        <div class="task-content">
          <div class="teacher-detail">
            <div class="teacher-cont">
              <div class="avatar"></div>
              <div class="info">
                <div class="name">
                  周芷若 九阴白骨爪 &lt;张真人&gt;作业
                </div>
                <div class="date">
                  2019/12/23 12:42
                </div>
              </div>
            </div>
            <div class="delete">
              <span class="iconfont iconshanchu"></span>
            </div>
          </div>

          <div class="task-area">
            <div class="tit">
              作业内容
              <div class="edit">
                <span class="iconfont iconxiugai"></span>
              </div>
            </div>
            <div class="txt">
              极寒午时正，独坐寒冰床。裸体面朝北， 气行小周天。 五心朝天式，打开丹田门。寒气螺旋入，收发当自如。
            </div>
            <div class="voice">
              <div class="ico"></div> 5”
            </div>
            <div class="media">

            </div>
            <div class="task-time">
              12小时前
            </div>

            <!-- Str 评论区域 -->
            <div class="comment-list">
              <div class="comment-item">
                <div class="tit">张三丰：</div>
                <div class="cont">
                  <div class="text">
                    完成不错
                  </div>
                </div>
              </div>
              <div class="comment-item">
                <div class="tit">张三丰：</div>
                <div class="cont">
                  <div class="voice">
                    <div class="ico"></div> 5”
                  </div>
                </div>
              </div>
              <div class="comment-item">
                <div class="tit">张三丰：</div>
                <div class="cont">
                  <div class="media">
                    23:04
                  </div>
                </div>
              </div>
            </div>
            <!-- End 评论区域 -->
          </div>

        </div>

      </div>
    </div>
  </section>
</template>

<script>
import StudentItem from "~/components/StudentItem.vue";

export default {
  components: {
    /** 表单数据 */
    "student-item": StudentItem
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
