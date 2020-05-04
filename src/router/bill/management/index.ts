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

const managementRoutes: any = [
  {
    path: "management",
    component: Home,
    name: "billManagement",
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
    ].concat(editingRoutes, costRoutes),
  },
];

export default managementRoutes;
