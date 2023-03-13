<script>
	import { RouterLink, RouterView } from 'vue-router'
	import HelloWorld from './components/HelloWorld.vue'
	export default {
	data() {
		return {
			scrolled: false
		};
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
			<div class="page p1 vh-100 vw-100"></div>
			<div class="page p2 vh-100 vw-100"></div>
			<div class="page p3 vh-100 vw-100"></div>
		</div>

	</div>
</template>

<style scoped>

.text {
  text-shadow: 3px 3px 10px #666;
  text-decoration: none;
  border-left: 10px dotted #E8CD26;
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

.page {
	height: 100vh;
	width: 100vw;
	background-color: rgb(22, 192, 156);
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
