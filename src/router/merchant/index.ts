const Home = () =>
  import(/* webpackChunkName: "merchant" */ "@/view/merchant/Home.vue");
const Profile = () =>
  import(/* webpackChunkName: "merchant" */ "@/view/merchant/Profile.vue");
const Dashboard = () =>
  import(/* webpackChunkName: "merchant" */ "@/view/merchant/Dashboard.vue");
const Add = () =>
  import(/* webpackChunkName: "merchant" */ "@/view/merchant/Add.vue");
const AuthorizationList = () =>
  import(
    /* webpackChunkName: "merchant" */ "@/view/merchant/AuthorizationList.vue"
  );

const merchantRoutes: any = [
  {
    path: "/merchant",
    component: Home,
    redirect: {
      name: "merchantDashboard",
    },
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: "dashboard",
        name: "merchantDashboard",
        component: Dashboard,
        meta: {
          title: "教务中心",
          requireManager: true,
        },
      },
      {
        path: "profile",
        name: "merchantProfile",
        component: Profile,
        meta: {
          title: "机构信息",
        },
      },
      {
        path: "authorizations",
        name: "merchantAuthorizations",
        component: AuthorizationList,
        meta: {
          title: "手机号码绑定记录",
          requireManager: true,
        },
      },
      {
        path: "add",
        name: "merchantAdd",
        component: Add,
        meta: {
          title: "注册学校",
        },
      },
    ],
  },
];

export default merchantRoutes;
