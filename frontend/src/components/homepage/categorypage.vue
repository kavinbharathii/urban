
<script>

import CategoryCard from './CategoryCard.vue'

export default {
    data() {
        return{
            user: 'barath',
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
    <div>
        <div class="p2 vw-100">
            <div class="cards-container" v-for="(service , ind) in this.services" :key="ind">
                
                    <router-link :to="{ path: `/services/${service}` }">
                        <CategoryCard :categoryName='service' description="Description." />
                    </router-link>

                    <!-- <router-link to="/computer-services">
                        <CategoryCard categoryName="Computer" description="Description." />
                    </router-link>
                    <router-link to="/laptop-services">
                        <CategoryCard categoryName="Laptop" description="Description." />
                    </router-link>

                    <router-link to="/cctv-services">
                        <CategoryCard categoryName="CCTV" description="Description." />
                    </router-link>
                    <router-link to="/printer-services">
                        <CategoryCard categoryName="Printer" description="Description." />
                    </router-link>
                    <router-link to="/ups-services">
                        <CategoryCard categoryName="UPS" description="Description." />
                    </router-link>

                    <router-link to="/electrician-services">
                        <CategoryCard categoryName="Electrician" description="Description." />
                    </router-link>
                    <router-link to="/plumbing-services">
                        <CategoryCard categoryName="Plumbing" description="Description." />
                    </router-link> -->
            </div>
        </div>
    </div>
</template>


<style scoped>

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