const Home = () =>
  import(
    /* webpackChunkName: "bill-management" */ "@/view/bill/management/Home.vue"
  );
const Dashboard = () =>
  import(
    /* webpackChunkName: "bill-management" */ "@/view/bill/management/Dashboard.vue"
  );

import editingRoutes from "./editing";
import costRoutes from "./cost";
import couponRoutes from "./coupon";

const managementRoutes: any = [
  {
    path: "management",
    component: Home,
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "dashboard",
        name: "billManagementDashboard",
        component: Dashboard,
        meta: { title: "收款清单" },
      },
    ].concat(editingRoutes, costRoutes, couponRoutes),
  },
];

export default managementRoutes;
