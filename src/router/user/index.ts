const Home = () =>
  import(/* webpackChunkName: "user" */ "@/view/user/Home.vue");
const History = () =>
  import(/* webpackChunkName: "user" */ "@/view/user/History.vue");

import studentRoutes from "./student";

const userRoutes: any = [
  {
    path: "/user",
    component: Home,
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "history",
        name: "userHistory",
        component: History,
        meta: {
          title: "浏览历史",
        },
      },
    ].concat(studentRoutes),
  },
];

export default userRoutes;
