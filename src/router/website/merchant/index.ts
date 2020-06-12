const Home = () =>
  import(/* webpackChunkName: "website" */ "@/view/website/merchant/Home.vue");

const Merchant = () =>
  import(
    /* webpackChunkName: "website" */ "@/view/website/merchant/Merchant.vue"
  );

const Course = () =>
  import(
    /* webpackChunkName: "website" */ "@/view/website/merchant/Course.vue"
  );

const Article = () =>
  import(
    /* webpackChunkName: "website" */ "@/view/website/merchant/Article.vue"
  );

const Album = () =>
  import(/* webpackChunkName: "website" */ "@/view/website/merchant/Album.vue");

import editingRoutes from "./editing";

const merchantRoutes: any = [
  {
    path: "merchants/:merchantId",
    component: Home,
    name: "websiteMerchantHome",
    redirect: {
      name: "websiteMerchant",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "websiteMerchant",
        component: Merchant,
        meta: { title: "机构官网" },
      },
      {
        path: "courses/:courseId",
        name: "websiteMerchantCourse",
        component: Course,
        meta: { title: "课程详情" },
      },
      {
        path: "albums/:albumId",
        name: "websiteMerchantAlbum",
        component: Album,
        meta: { title: "机构相册" },
      },
      {
        path: "articles/:articleId",
        name: "websiteMerchantArticle",
        component: Article,
        meta: { title: "最新动态" },
      },
    ].concat(editingRoutes),
  },
];

export default merchantRoutes;
