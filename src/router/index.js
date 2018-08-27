import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Game from '@/components/Game'
import Tip from '@/components/Tip'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Game',
      name: 'Game',
      component: Game
    },
    {
      path: '/Tip',
      name: 'Tip',
      component: Tip
    }
  ]
})
