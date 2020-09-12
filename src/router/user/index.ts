const Home = () =>
  import(/* webpackChunkName: "user" */ "@/view/user/Home.vue");

import studentRoutes from "./student";

const userRoutes: any = [
  {
    path: "/user",
    component: Home,
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [].concat(studentRoutes),
  },
];

export default userRoutes;
