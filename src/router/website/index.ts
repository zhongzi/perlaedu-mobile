const Home = () =>
  import(/* webpackChunkName: "website" */ "@/view/website/Home.vue");

const Guide = () =>
  import(/* webpackChunkName: "website" */ "@/view/website/guide/Guide.vue");

import merchantRoutes from "./merchant";
import unionRoutes from "./union";

const websiteRoutes: any = [
  {
    path: "/websites",
    component: Home,
    name: "websiteHome",
    meta: {
      requireOpenid: true,
      requireAuth: true,
      hideCopyright: true,
    },
    children: [
      {
        path: "guide",
        component: Guide,
        name: "newWebsiteGuide",
        meta: { title: "30天免费门户网站体验资格申请" },
      },
    ].concat(merchantRoutes, unionRoutes),
  },
];

export default websiteRoutes;
