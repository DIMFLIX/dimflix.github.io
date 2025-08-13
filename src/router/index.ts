import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NotDone from "@/views/NotDone.vue";
import ArticlesPage from "@/views/ArticlesPage.vue";
import ArticlePage from "@/views/ArticlePage.vue";
import Portfolio from "@/views/Portfolio.vue";
import About from "@/views/About.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { title: 'DIMFLIX | Home' }
  }, 
  {
    path: "/about",
    name: "about",
    component: About,
    meta: { title: 'DIMFLIX | About' }
  },
  {
    path: "/portfolio",
    name: "portfolio",
    component: Portfolio,
    meta: { title: 'DIMFLIX | Portfolio' }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: ArticlesPage,
    meta: { title: 'DIMFLIX | Articles' }
  },
  {
    path: '/articles/:id',
    name: 'Article',
    component: ArticlePage,
    props: true,
    meta: { title: 'DIMFLIX | Article' }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Update document title based on route meta
router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }
  next();
});

export default router;
