import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import categoryServices from '../views/categoryServices.vue'
import signIn from '../views/signIn.vue'
import signUp from '../views/signUp.vue'
import cart from '../views/cartView.vue'
import adminPage from '../components/adminpage/adminPage.vue'
import orders from '../views/order.vue'
import addservices from '../components/adminpage/addservices.vue'
import addcategory from '../components/adminpage/addcategory.vue'
import editservices from '../components/adminpage/editservices.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '',
			component: Home,
			meta: {
				title: 'Serve To All'
			}
		},
		{
			path: '/signin',
			component: signIn,
			meta: {
				title: 'SignIn'
			}
		},
		{
			path: '/signup',
			component: signUp,
			meta: {
				title: 'SignUp'
			}
		},
		{
			path: '/cart',
			component: cart,
			meta: {
				title: 'Cart'
			}
		},
		{
			path: '/yourorders',
			component: orders,
			props(route) {
				return {  useremail : route.query.useremail }
			},
			meta: {
				title: 'Booking Orders'
			}
		},
		{
			path: '/cctv-services',
			component: categoryServices,
			props: {
				categoryName: 'CCTV'
			},
			meta: {
				title: 'CCTV Services'
			}
		},
		{
			path: '/computer-services',
			component: categoryServices,
			props: {
				categoryName: 'Computer'
			},
			meta: {
				title: 'Computer Services'
			}
		},
		{
			path: '/electrician-services',
			component: categoryServices,
			props: {
				categoryName: 'Electrician'
			},
			meta: {
				title: 'Electrician Services'
			}
		},
		{
			path: '/plumbing-services',
			component: categoryServices,
			props: {
				categoryName: 'Plumbing'
			},
			meta: {
				title: 'Plumbing Services'
			}
		},
		{
			path: '/admin',
			component: adminPage,
			meta: {
				title: 'Admin Dashboard'
			}
		},
		{
			path:'/admin/addservices',
			component: addservices,
			meta: {
				title: 'AddServices'
			}
		},
		{
			path:'/admin/addcategory',
			component: addcategory,
			meta: {
				title: 'AddCategory'
			}
		},
		{
			path:'/admin/editservices',
			component: editservices,
			meta: {
				title: 'EditServices'
			}
		},
		{
			path: '/services/:serid',
			component: categoryServices,
			// props: {
			// 	categoryName: $route.params.serid
			// },
		}
	]
})

router.beforeEach((to, from, next) => {
	const title = to.meta.title
	if (title) {
	  document.title = title
	}
	next()
  })

export default router
