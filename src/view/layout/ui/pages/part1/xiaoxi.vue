<template>
  <section class="container">
    <div class="xiaoxi">
      <div class="info">
        <div class="tit">
          <div class="index">28</div> 武当一班
        </div>
        <div class="txt">
          长沙全真修真学校
        </div>
      </div>

      <div class="student-list">
        <div class="student-item">
          <student-item :isBind="true"></student-item>
        </div>
        <div class="student-item">
          <student-item :active="true"></student-item>
        </div>
        <div class="student-item">
          <student-item></student-item>
        </div>
        <div class="student-item">
          <student-item></student-item>
        </div>
        <div class="student-item">
          <student-item></student-item>
        </div>
      </div>

      <div class="task-area">
        <div class="tit"># 课后作业</div>
        <div class="voice">
          <div class="ico"></div> 5”
        </div>
        <div class="media">

        </div>
        <div class="task-info">
          <div class="time">
            2019/10/13 周二
          </div>
          <div class="triggers">
            <div class="trigger-item">
              <span class="iconfont iconpinglun"></span>评论
            </div>
            <div class="trigger-item">
              <span class="iconfont iconchehui"></span>撤回
            </div>
          </div>
        </div>
      </div>

      <div class="comment-list">
        <div class="comment-item">
          <div class="tit">张三丰：</div>
          <div class="cont">
            <div class="text">
              收到作业，认真完成！收到作业，认真完成！收到作业，认真完成！收到作业，认真完成！收到作业，认真完成！
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
              <span class="iconfont iconbofang"></span>23:04
            </div>
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
      title: "消息"
    };
  }
};
</script>
<style lang="scss">
</style>
