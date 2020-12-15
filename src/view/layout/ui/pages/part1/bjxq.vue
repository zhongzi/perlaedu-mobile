<template>
  <section class="container">
    <div class="bjxq">
      <div class="user-list">
        <div class="tit">
          班级成员
          <div class="count">
            5
          </div>

          <span class="iconfont iconrenshu"></span>
        </div>
        <div class="cont">
          <div class="user-item">
            <div class="avatar"></div>
            <div class="name">张翠山</div>
            <div class="trigger">×</div>
          </div>

          <div class="user-item">
            <div class="avatar"></div>
            <div class="name">张翠山</div>
            <div class="trigger">×</div>
          </div>

          <div class="user-item">
            <div class="avatar"></div>
            <div class="name">张翠山</div>
            <div class="trigger">×</div>
          </div>

          <div class="user-item">
            <div class="avatar"></div>
            <div class="name">张翠山</div>
            <div class="trigger">×</div>
          </div>

          <div class="add-trigger">
            <span class="iconfont iconjiahao"></span>
            <div>添加</div>
          </div>
        </div>
      </div>

      <div class="filed-list">
        <div class="ai-row">
          <div class="ai-col flex-1">
            <arrow-item
              type="link"
              label="班级名"
              value="武当派 真武七截阵"
            ></arrow-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <arrow-item
              type="link"
              label="科目"
              value="大力金刚指"
            ></arrow-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="radio"
              label="科目"
              value="大力金刚指"
            ></filed-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="radio"
              :active="true"
              label="科目"
              value="大力金刚指"
            ></filed-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <arrow-item
              type="link"
              label="老师"
              value="武当派 真武七截阵"
            ></arrow-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <arrow-item
              type="link"
              label="第二老师"
              value=""
            ></arrow-item>
          </div>
        </div>
      </div>

      <button-group :buttons="buttons"></button-group>
    </div>
  </section>
</template>

<script>
import FiledItem from "~/components/FiledItem.vue";
import ArrowItem from "~/components/ArrowItem.vue";
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    "filed-item": FiledItem,
    "arrow-item": ArrowItem,
    "button-group": ButtonGroup
  },

  data() {
    return {
      buttons: [
        {
          text: "解散本班",
          type: "cancel",
          width: "126"
        },
        {
          text: "课程点名",
          type: "primary",
          width: "160"
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
