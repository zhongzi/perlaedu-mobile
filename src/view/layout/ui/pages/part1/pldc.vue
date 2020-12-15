<template>
  <section class="container">
    <div class="pldc">
      <div class="title">请转发当前页面到电脑上操作</div>

      <div class="steps">
        <div
          class="step"
          v-for="(item, index) in steps"
          :key="index"
        >
          <div class="ico">{{index + 1}}</div>
          <div class="cont">
            <div class="tit">{{item.tit}}</div>
            <div
              class="txt"
              v-if="item.txt"
            >{{item.txt}}</div>
            <div
              class="tip"
              v-if="item.tip"
            >{{item.tip}}</div>
          </div>
        </div>
      </div>

      <div class="export-btn"></div>
    </div>
  </section>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      steps: [
        {
          tit: "点击下载「Excel数据模版」",
          txt:
            "如点击无反应，复制地址http://files-cdn.perlaedu.com/default/import_template.xisx",
          tip: ""
        },
        {
          tit: "用下载模版整理好要导入的老师和学生数据",
          txt: "",
          tip: ""
        },
        {
          tit: "点击上传数据",
          txt: "",
          tip:
            "注：重复导入相同数据不会产生重复记录，不存在的班级也会自动创建，如课时有变动，以最后一次导入为准导入过程中不会发送课时变动提醒，请放心操作。"
        }
      ]
    };
  },

  head() {
    return {
      title: "批量导入"
    };
  }
};
</script>
<style lang="scss">
</style>
