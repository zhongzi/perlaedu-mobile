import Vue from "vue";

declare module "vue/types/vue" {
  interface Vue {
    $configs: any;
    $auth: any;
    $weixin: any;
    $tools: any;
    $toast: any;
    $loading: any;
    $densityStr: any;
    $bus: any;
    $confirm: any;
    $hui: any;
  }
}
