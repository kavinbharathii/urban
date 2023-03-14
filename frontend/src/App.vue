<script>
	import { RouterLink, RouterView } from 'vue-router'
	import carousel from './components/carousel.vue'
	import aboutUs from './components/aboutus.vue'
	import contactUs from './components/contactus.vue'
	export default {
	data() {
		return {
			scrolled: false
		};
	},
	components : {
		carousel,
		aboutUs,
		contactUs
	},
	created() {
    	this.handleScroll();
  	},
	methods: {
		handleScroll() {
			setInterval(() => {
				this.scrolled = window.pageYOffset >= 10; }, 200);
			}
		}
	};

</script>

<template>
	<div>

		<header class="container-fluid fixed-top bg-white d-flex justify-content-center align-items-center header" :class="{ scrolled : scrolled  }">
			<div>Serve Arena</div>
		</header>
		<div class="pages">
			<div class="p1 vh-100 vw-100"></div>
			<div class="p2 vh-100 vw-100"></div>
			<div class="p3 vh-100 vw-100"></div>
			<carousel/>
			<aboutUs/>
			<contactUs/>
			<div class="p1 vh-100 vw-100"></div>
		</div>

	</div>
</template>

<style scoped>

.header div {
	font-size: 40px;
	text-shadow: 3px 3px 10px #666;
	text-decoration: none;
	border-bottom: 10px dotted #666;
}

.header {
	padding: 24px !important;
    -webkit-backdrop-filter: blur(60px);
    border-radius: 0 0 32px 32px;
	transition: background-color 0.3s ease-in-out;
}

.scrolled {
	background-color: #E8CD26 !important;
	backdrop-filter: blur(60px);
	background: hsla(0,0%,100%,.5) !important;
	backdrop-filter: blur(60px);
}

.pages {
	scroll-snap-type: y mandatory;
	overflow-y: scroll;
}

.pages *{
	scroll-snap-align: start;
}

.p1 {
	background-color: rgb(233, 99, 108);
}

.p2 {
	background-color: rgb(45, 83, 180);
}

.p3 {
	background-color: rgb(22, 192, 156);
}


</style>
