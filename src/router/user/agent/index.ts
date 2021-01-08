const Home = () =>
  import(/* webpackChunkName: "user-agent" */ "@/view/user/agent/Home.vue");

const Dashboard = () =>
  import(
    /* webpackChunkName: "user-agent" */ "@/view/user/agent/Dashboard.vue"
  );

const agentRoutes: any = [
  {
    path: "agents/",
    component: Home,
    redirect: {
      name: "dashboard",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
        meta: { title: "代理中心", keepAlive: true },
      },
    ],
  },
];

export default agentRoutes;
