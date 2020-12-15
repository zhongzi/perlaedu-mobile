<template>
  <section class="container">
    <div class="zhtbj">
      <div class="bd">
        <div class="item-wrap">
          <arrow-item
            label="名称"
            value="第一综合体"
            className="margin"
          ></arrow-item>
        </div>
        <div class="item-wrap">
          <arrow-item
            label="地址"
            value=""
            className="margin"
          ></arrow-item>
        </div>
        <div class="item-wrap">
          <arrow-item
            label="状态"
            value="招商中"
            className="margin"
          ></arrow-item>
        </div>
        <div class="item-wrap">
          <arrow-item
            label="备注"
            value=""
            className="margin"
          ></arrow-item>
        </div>
        <div class="item-wrap">
          <arrow-item
            label="链接封面"
            value=""
            className="margin"
          ></arrow-item>
        </div>

        <div class="item-wrap">
          <filed-item
            label="链接标题"
            placeholder="我推荐你购买综合体护照"
            type="input"
            className="margin"
          ></filed-item>
        </div>
        <div class="item-wrap">
          <filed-item
            label="链接描述"
            placeholder="学生专享 不可多得"
            type="input"
            className="margin"
          ></filed-item>
        </div>
        <div class="item-wrap">
          <arrow-item
            label="综合体成员"
            :active="true"
            value=""
            className="margin"
          >
            <div class="item-cont">
              <div class="item">
                <div class="name">
                  长沙佩拉教育咨询有限公司
                  <div class="tag style-1">已审核</div>
                </div>
                <div class="arrow"></div>
              </div>
              <div class="item">
                <div class="name">
                  长沙佩拉教育咨询有限公司
                  <div class="tag style-2">已审核</div>
                </div>
                <div class="arrow"></div>
              </div>
            </div>
          </arrow-item>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ArrowItem from "~/components/ArrowItem.vue";
import FiledItem from "~/components/FiledItem.vue";

export default {
  components: {
    "arrow-item": ArrowItem,
    "filed-item": FiledItem
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
