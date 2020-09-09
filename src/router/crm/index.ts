const Home = () => import(/* webpackChunkName: "crm" */ "@/view/crm/Home.vue");

import clueRoutes from "./clue";
import customerRoutes from "./customer";

const crmRoutes: any = [
  {
    path: "/crm",
    component: Home,
    name: "crmHome",
    redirect: {
      name: "crmClueList",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [].concat(customerRoutes, clueRoutes),
  },
];

export default crmRoutes;
