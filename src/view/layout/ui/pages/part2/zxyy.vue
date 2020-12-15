<template>
  <section class="container ai-background">
    <div class="zxyy">
      <div class="hd">
        <class-picker
          text="新东方..."
          size="small"
        ></class-picker>
        <div class="btn">
          <div class="circle"></div>在线预约
        </div>
        <div class="btn active">
          <div class="circle"></div>预约记录
        </div>
      </div>

      <div class="bd ai-content">
        <div class="subscribe-list">
          <div class="subscribe-item">
            <div class="title">
              <div class="teacher-info">
                <div class="avatar"></div>
                <div class="name">
                  <div class="tit">明教教主 张无忌</div>
                  <div class="txt">金庸</div>
                </div>
              </div>
              <div class="trigger">
                <div class="subscribe-btn"></div>
                <div class="arrow">
                  <span class="iconfont iconjiantou"></span>
                </div>
              </div>
            </div>

            <div class="content">
              <div class="btn">排课</div>
              <div class="handle-item">
                <div class="date">2019年11月18日（周一）</div>
                <div class="times">
                  <div class="time-item active">
                    <div class="circle"></div> 10:00
                  </div>
                  <div class="time-item">
                    <div class="circle"></div> 10:00
                  </div>
                  <div class="time-item">
                    <div class="circle"></div> 10:00
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="subscribe-item">
            <div class="title">
              <div class="teacher-info">
                <div class="avatar"></div>
                <div class="name">
                  <div class="tit">明教教主 张无忌</div>
                  <div class="txt">金庸</div>
                </div>
              </div>
              <div class="trigger">
                <div class="subscribe-btn active"></div>
                <div class="arrow">
                  <span class="iconfont iconjiantou"></span>
                </div>
              </div>
            </div>

            <div class="content">
              <div class="btn">排课</div>
              <div class="handle-item">
                <div class="date">2019年11月18日（周一）</div>
                <div class="times">
                  <div class="time-item active">
                    <div class="circle"></div> 10:00
                  </div>
                  <div class="time-item">
                    <div class="circle"></div> 10:00
                  </div>
                  <div class="time-item">
                    <div class="circle"></div> 10:00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ClassPicker from "~/components/ClassPicker.vue";

export default {
  components: {
    "class-picker": ClassPicker
  },
  head() {
    return {};
  }
};
</script>
<style lang="scss">
</style>
