<template>
  <section class="container">
    <div class="jgjs">
      <div class="hd">
        优质培训机构
      </div>

      <div class="bd ai-content">
        <div class="mechanism-info">
          <div class="avatar"></div>
          <div class="info">
            <div class="name">
              蔷薇网络科技
            </div>
            <div class="status">
              <div class="item">
                <span class="iconfont iconliulan"></span> 3239
              </div>

              <div class="item">
                <span class="iconfont iconzhuanfa"></span> 3239
              </div>
            </div>
          </div>
        </div>

        <div class="address-info">
          <div class="info">
            <span class="iconfont icongenjinren"></span> 湖南省长沙市天心区芙蓉南路一段231号
          </div>
          <div class="arrow">
            <span class="iconfont iconjiantou"></span>
          </div>
        </div>

        <div class="mechanism-desc">
          <div class="tit">机构介绍</div>
          <div class="txt">“根据《中国居民膳食指南2012版》的说明, 我国居民维生素C的每日推荐摄入量为100mg。当然这是针对全国居民进行统计的量</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import PayItem from "~/components/PayItem";

export default {
  components: {
    "pay-item": PayItem
  },
  head() {
    return {
      title: "机构介绍"
    };
  }
};
</script>
<style lang="scss">
</style>
