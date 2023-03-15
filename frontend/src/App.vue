<script>
	import { RouterLink, RouterView } from 'vue-router'
	import aboutUs from './components/aboutus.vue'
	import contactUs from './components/contactus.vue'
	import CategoryCard from './components/CategoryCard.vue'
	import homevue from './components/Home.vue'
	export default {

	data() {
		return {
			scrolled: false
		};
	},

	components: {
		homevue,
		CategoryCard,
		contactUs,
		aboutUs
	}
};

</script>

<template>
	<div id="dev">
		<nav class="nav-bar">
			<div class="logo">IT Arena</div>

			<div class="nav-links">
				<a class="nav-link" href="">Home</a>
				<a class="nav-link" href="">Services</a>
				<a class="nav-link" href="">Contact</a>
				<a class="nav-link" href="">About</a>
			</div>
		</nav>

		<div class="full-page">

			<div class="page">
				<homevue/>
			</div>

			<div class="page">
				<div class="p2 vh-100 vw-100">
					<div class="cards-container">
						<div class="cards-col col-one">
							<CategoryCard categoryName="Computer" description="Description." />
							<CategoryCard categoryName="Laptop" description="Description." />
						</div>

						<div class="cards-col col-two">
							<CategoryCard categoryName="CCTV" description="Description." />
							<CategoryCard categoryName="Printer" description="Description." />
							<CategoryCard categoryName="UPS" description="Description." />
						</div>

						<div class="cards-col col-three">
							<CategoryCard categoryName="Electrician" description="Description." />
							<CategoryCard categoryName="Plumbing" description="Description." />
						</div>
					</div>
				</div>
			</div>

			<div class="p3 page vh-100 vw-100"></div>
			
			<div class="page vh-100 vw-100">
				<aboutUs />
			</div>

			<div class="page vh-100 vw-100">
				<contactUs />
			</div>

		</div>

	</div>

</template>

<style scoped>

.nav-bar {
	font-size: 40px;
	text-decoration: none;

	display: flex;
	justify-content: space-between;
	align-items: center;
	/* background: linear-gradient(#fefefe, transparent); */
	position: fixed;
	top: 0;
	left: 0;

	width: 100vw;
}

.logo {
	margin-left: 1.5em;
	margin-top: .2em;
}

.nav-links {
	margin-right: 1.5em;

	display: flex;
	flex-direction: row;
	gap: 0.4em;
}

.nav-link {
	text-decoration: none;
	font-size: 0.4em;
	text-transform: uppercase;

	/* style */
	position: relative;
	z-index: 1;
}


.nav-link::before {
	content: '';
	position: absolute;
	z-index: -1;
	top: 0;
	bottom: 0;
	left: -0.25em;
	right: -0.25em;
	background-color: #fc3171bf;
	transform-origin: center right;
	transform: scaleX(0);
	transition: transform 0.2s ease-in-out;
}

.nav-link:hover::before {
	transform: scaleX(1);
	transform-origin: center left;
}


.p3 {
	background-color: rgb(22, 192, 156);
}

.cards-container {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;

	justify-content: center;
	align-items: center;
	gap: 1.5em;

	min-width: 100vw;
    min-height: 100vh;
}

.full-page {
	max-width: 100vw;
    max-height: 100vh;
    overflow: scroll;
    scroll-snap-type: y mandatory;
}

.page {
	scroll-snap-align: start;
}

</style>
