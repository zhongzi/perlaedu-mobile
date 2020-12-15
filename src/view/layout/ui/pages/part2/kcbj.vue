<template>
  <section class="container">
    <div class="kcbj">
      <div class="hd">
        在线课程
        <div class="mask">
          <span class="iconfont icontianjiatupian"></span>
        </div>
      </div>

      <div class="bd ai-content">
        <div class="fileds">
          <arrow-item
            label="标题"
            value="九阴白骨爪-公开课"
          ></arrow-item>
          <div class="check-btn-area">
            <div class="btn-item">已导入</div>
            <div class="btn-item active">
              <div class="ico"></div>已导入
            </div>
            <div class="btn-item setting">
              <span class="iconfont iconshezhi"></span>
            </div>
          </div>
          <arrow-item
            label="课程视频"
            value="共1个"
          ></arrow-item>
          <arrow-item
            label="内部教学课程"
            type="radio"
          ></arrow-item>
          <arrow-item
            label="上锁"
            value="付费锁"
          ></arrow-item>
        </div>

        <div class="edit-area">
          <div class="edit-hd">
            <div class="tit">课程介绍</div>
            <div class="handle">
              <div class="ico text"></div>
              <div class="ico image"></div>
            </div>
          </div>
          <div class="edit-bd">
            <div class="edit-item">
              <handles-area>
                <div class="txt">未来幼儿园抽奖活动</div>
              </handles-area>
            </div>
            <div class="edit-item">
              <div class="edit-cont">
                1. 活动时间：2018年1月25日—2018年2月9日（在活动时间内，活动资源送完则活动自动结束）；
                2. 参与方式：在“浙江移动”微信公众号中回复“福袋”关键字；
              </div>
              <handles-area>
                <div class="txt"></div>
              </handles-area>
            </div>
            <div class="edit-item">
              <div class="edit-cont image">
                <div class="item-image">
                  <div class="cover">
                    <span class="iconfont iconshanchu"></span>
                  </div>
                </div>
              </div>
              <handles-area>
                <div class="txt">未来幼儿园抽奖活动</div>
              </handles-area>
            </div>
          </div>
        </div>
      </div>

      <button-group
        :buttons="buttons"
        className="transparent"
      ></button-group>
    </div>
  </section>

</template>

<script>
import ArrowItem from "~/components/ArrowItem";
import ButtonGroup from "~/components/ButtonGroup";
import HandlesArea from "~/components/HandlesArea";

export default {
  components: {
    "arrow-item": ArrowItem,
    "button-group": ButtonGroup,
    "handles-area": HandlesArea
  },
  head() {
    return {
      title: "课程编辑"
    };
  },
  data() {
    return {
      buttons: [
        {
          text: "下架",
          type: "cancel",
          width: "126"
        },
        {
          text: "保存",
          type: "primary",
          width: "160"
        }
      ]
    };
  }
};
</script>
<style lang="scss">
</style>
