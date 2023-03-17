import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import categoryServices from '../views/services/categoryServices.vue'
import signIn from '../views/services/signIn.vue'
import signUp from '../views/services/signUp.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '',
			component: Home
		},
		{
			path: '/signin',
			component: signIn
		},
		{
			path: '/signup',
			component: signUp
		},
		{
			path: '/cart',
			// component: 
		},
		{
			path: '/cctv-services',
			component: categoryServices,
			props: {
				categoryName: 'CCTV'
			}
		},
		{
			path: '/computer-services',
			component: categoryServices,
			props: {
				categoryName: 'Computer'
			}
		}
	]
})

export default router
