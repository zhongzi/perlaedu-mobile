const Home = () =>
  import(/* webpackChunkName: "merchant" */ "@/view/merchant/Home.vue");
const Dashboard = () =>
  import(/* webpackChunkName: "merchant" */ "@/view/merchant/Dashboard.vue");

const merchantRoutes: any = [
  {
    path: "/merchant",
    component: Home,
    redirect: {
      name: "merchantDashboard",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
      requireManager: true,
    },
    children: [
      {
        path: "dashboard",
        name: "merchantDashboard",
        component: Dashboard,
        meta: { title: "教务中心" },
      },
    ],
  },
];

export default merchantRoutes;
