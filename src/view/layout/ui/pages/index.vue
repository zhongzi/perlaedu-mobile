<template>
  <section class="container">
    <div>
      <!-- <logo /> -->
      <!-- <h1 class="title">
        机械之家
      </h1> -->
      <h2 class="subtitle">
        AI教务静态页面
      </h2>
      <div class="links">
        <a href="part1/pldc">Excel批量导入</a>
        <a href="part1/rylb">人员列表</a>
        <a href="part1/qhls">切换老师</a>
        <a href="part1/jxs">加学生</a>
        <a href="part1/jks">加课时</a>
        <a href="part1/fxx">发消息</a>
        <a href="part1/bdmx">变动明细</a>
        <a href="part1/xsxq">学生详情</a>
        <a href="part1/xsxz">学生选择</a>
        <a href="part1/wdxs">我的学生</a>
        <a href="part1/xiaoxi">消息</a>
        <a href="part1/tjsj">添加时间</a>
        <a href="part1/dianming">点名</a>
        <a href="part1/dmrz">点名日志</a>
        <a href="part1/dmqr">点名确认</a>
        <a href="part1/bjlb">班级列表</a>
        <a href="part1/bjlb">班级列表展开</a>
        <a href="part1/bjdmxq">班级点名详情</a>
        <a href="part1/bjxq">班级详情</a>
        <a href="part1/pinglun">评论</a>
        <a href="part1/sjf">送积分</a>
      </div>
      <div class="links">
        <a href="part2/scsp">上传视频</a>
        <a href="part2/jzy">交作业</a>
        <a href="part2/zuoye">作业</a>
        <a href="part2/gzewm">关注二维码</a>
        <a href="part2/jrzht">加入综合体</a>
        <a href="part2/zxkc">在线课程</a>
        <a href="part2/zxkczjmx">在线课程资金明细</a>
        <a href="part2/zxyy">在线预约</a>
        <a href="part2/dsrw">定时任务</a>
        <a href="part2/dbsx">待办事项</a>
        <a href="part2/yxxs">意向学生</a>
        <a href="part2/huzhao">护照</a>
        <a href="part2/zsgj">招生跟进</a>
        <a href="part2/zfkc">支付课程</a>
        <a href="part2/xjzht">新建综合体</a>
        <a href="part2/jgjs">机构介绍</a>
        <a href="part2/qrtx">确认提醒</a>
        <a href="part2/glbq">管理标签</a>
        <a href="part2/zhtbj">综合体编辑</a>
        <a href="part2/bjdsrw">编辑定时任务</a>
        <a href="part2/bjspk">编辑视频课</a>
        <a href="part2/jiesuo">解锁</a>
        <a href="part2/kcbj">课程编辑</a>
        <a href="part2/kcxq">课程详情</a>
        <a href="part2/kcssz">课程锁设置</a>
        <a href="part2/genjin">跟进</a>
        <a href="part2/xzsp">选择视频</a>
        <a href="part2/yypk">预约排课</a>
        <a href="part2/yyjl">预约记录</a>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo
  },
  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0 auto;
  text-align: center;
}

.subtitle {
  padding: 2rem 0;
  color: #526488;
  font-size: 42px;
  font-weight: 300;
  word-spacing: 5px;
}

.links {
  padding-top: 15px;

  a {
    display: block;
    padding-bottom: 15px;
    color: #526488;
    font-size: 2rem;
    text-decoration: underline;
    letter-spacing: .2rem;
  }
}

</style>
