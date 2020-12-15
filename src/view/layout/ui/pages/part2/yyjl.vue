<template>
  <section class="container ai-background">
    <div class="yyjl">
      <div class="hd">
        <class-picker
          text="新东方烹饪"
          size="small"
        ></class-picker>
        <div class="btn">
          <div class="circle"></div>在线预约
        </div>
        <div class="btn active">
          <div class="circle"></div>预约记录
        </div>
      </div>

      <div class="bd">
        <div class="subscribe-list">
          <div class="subscribe-item">
            <div class="subscribe-title">
              <div class="txt">2019/11/25 周一</div>
              <div class="status-list">
                <div class="status-item">34</div>
                <div class="status-item">8</div>
                <div class="status-item">12</div>
                <div class="arrow active">
                  <span class="iconfont iconjiantou"></span>
                </div>
              </div>
            </div>
            <div class="subscribe-cont">
              <div class="title">
                <div class="teacher-info">
                  <div class="avatar"></div>
                  <div class="name">
                    <div class="tit">明教教主 张无忌</div>
                  </div>
                </div>
                <div class="status-list">
                  <div class="status-item">34</div>
                  <div class="status-item">8</div>
                  <div class="status-item">12</div>
                  <div class="arrow">
                    <span class="iconfont iconjiantou"></span>
                  </div>
                </div>
              </div>
              <div class="sub-cont">
                <div class="stu-item">
                  <div class="detail">
                    <div class="avatar"></div>
                    <div class="info">
                      <div class="name">
                        <div class="txt">全真弃子</div>
                        <div class="course">
                          <span class="iconfont iconkecheng"></span> 乾坤大挪移
                        </div>
                      </div>
                      <div class="time">
                        <div class="tag">待处理</div> 15:00-16:30
                      </div>
                    </div>
                  </div>

                  <div class="trigger">
                    <div class="btn">确认</div>
                    <div class="btn del">
                      <span class="iconfont iconshanchu"></span>
                    </div>
                  </div>
                </div>
                <div class="stu-item style-1">
                  <div class="detail">
                    <div class="avatar"></div>
                    <div class="info">
                      <div class="name">
                        <div class="txt">全真弃子</div>
                        <div class="course">
                          <span class="iconfont iconkecheng"></span> 乾坤大挪移
                        </div>
                      </div>
                      <div class="time">
                        <div class="tag">待处理</div> 15:00-16:30
                      </div>
                    </div>
                  </div>

                  <div class="trigger">
                    <div class="btn">确认</div>
                    <div class="btn del">del</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="legend">
          <div class="txt">图例</div>
          <div class="items">
            <div class="item">
              <div class="point"></div> 已预约
            </div>
            <div class="item">
              <div class="point"></div> 已确认
            </div>
            <div class="item">
              <div class="point"></div> 已完成
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
