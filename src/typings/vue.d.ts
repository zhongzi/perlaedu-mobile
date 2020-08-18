import Vue from "vue";

declare module "vue/types/vue" {
  interface Vue {
    $configs: any;
    $auth: any;
    $weixin: any;
    $tools: any;
    $hui: any;
    $densityStr: any;
    $PosterBuilder: any;
    $bus: any;
    $db: any;
  }
}
