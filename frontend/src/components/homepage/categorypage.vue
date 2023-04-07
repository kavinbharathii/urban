
<script>

import CategoryCard from './CategoryCard.vue'

export default {
    data() {
        return{
            services: [
                'Computer',
                'Laptop',
                'CCTV',
                'Printer',
                'Ups',
                'Electrician',
                'Plumbing'
            ]
        }
    },
    components: {
        CategoryCard
    }

}
</script>

<template>
    <div id="dev">
        <h1>Our Services</h1>
        <div class="p2 vw-100">
            <div class="cards-container" v-for="(service , ind) in this.services" :key="ind">
                
                    <router-link :to="{ path: `/services/${service}` }">
                        <CategoryCard :categoryName='service' description="Description." />
                    </router-link>
            </div>
        </div>
    </div>
</template>


<style scoped>

#dev {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: "Satoshi", sans-serif;
}

#dev > h1 {
    font-size: 4em;
    font-family: "Satoshi", sans-serif;
}

.p2 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.cards-container {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;

	justify-content: center;
	align-items: center;
	gap: 1.5em;

	padding: 2em 0;
}

.cards-container a {
	min-width: 25em;
}
</style>