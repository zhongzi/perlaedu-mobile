const Home = () => import(/* webpackChunkName: "crm" */ "@/view/crm/Home.vue");

const Dashboard = () =>
  import(/* webpackChunkName: "crm" */ "@/view/crm/Dashboard.vue");

import clueRoutes from "./clue";
import customerRoutes from "./customer";
import zoneRoutes from "./zone";

const crmRoutes: any = [
  {
    path: "/crm",
    component: Home,
    redirect: {
      name: "crmDashboard",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "crmDashboard",
        component: Dashboard,
        meta: {
          title: "客户线索",
        },
      },
    ].concat(customerRoutes, clueRoutes, zoneRoutes),
  },
];

export default crmRoutes;
