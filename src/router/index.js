import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Quiz from '../components/QuizzPage.vue'
import Ox from '../components/result/ResultOx.vue'
import Spice from '../components/result/ResultSpice.vue'
import Pipa from '../components/result/ResultPipa.vue'
import Flui from '../components/result/ResultFlui.vue'
import Mvp from '../components/result/ResultMvp.vue'
import Wire from '../components/result/ResultWire.vue'
import Orfil from '../components/result/ResultOrfil.vue'
import Tobo from '../components/result/ResultTobo.vue'
import Poko from '../components/result/ResultPoko.vue'
import Ignite from '../components/result/ResultIgnite.vue'
import Home from '../components/LandingPage.vue'
import CreditPage from '../components/CreditPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/Quiz',
      name: 'Quiz',
      component: Quiz,
    },
    {
      path: '/result/SPICE',
      name: 'ResultSpice',
      component: Spice,
    },
    {
      path: '/result/OX',
      name: 'ResultOx',
      component: Ox,
    },
    {
      path: '/result/PIPA',
      name: 'ResultPipa',
      component: Pipa,
    },
    {
      path: '/result/FLUI',
      name: 'ResultFlui',
      component: Flui,
    },
    {
      path: '/result/MVP',
      name: 'ResultMvp',
      component: Mvp,
    },
    {
      path: '/result/WIRE',
      name: 'ResultWire',
      component: Wire,
    },
    {
      path: '/result/ORFIL',
      name: 'ResultOrfil',
      component: Orfil,
    },
    {
      path: '/result/TOBO',
      name: 'ResultTobo',
      component: Tobo,
    },
    {
      path: '/result/POKO',
      name: 'ResultPoko',
      component: Poko,
    },
    {
      path: '/result/IGNITE',
      name: 'ResultIgnite',
      component: Ignite,
    },
    {
      path: '/credit',
      name: 'CreditPage',
      component: CreditPage,
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
