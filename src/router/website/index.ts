const Home = () =>
  import(/* webpackChunkName: "website" */ "@/view/website/Home.vue");

import merchantRoutes from "./merchant";
import unionRoutes from "./union";

const websiteRoutes: any = [
  {
    path: "/websites",
    component: Home,
    name: "websiteHome",
    redirect: {
      name: "websiteMerchant",
      params: {
        merchantId: 1,
      },
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
      hideCopyright: true,
    },
    children: [].concat(merchantRoutes, unionRoutes),
  },
];

export default websiteRoutes;
