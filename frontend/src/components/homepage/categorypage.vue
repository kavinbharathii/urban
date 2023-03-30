
<script>

import CategoryCard from './CategoryCard.vue'

export default {
    data() {
        return{

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
            <div class="cards-container">
                    <router-link to="/computer-services">
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
                    </router-link>
            </div>
        </div>
    </div>
</template>


<style scoped>
.cards-container {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;

	justify-content: center;
	align-items: center;
	gap: 1.5em;

	min-width: 100vw;
	min-height: 100vh;

	padding: 2em 0;
}

.cards-container a {
	min-width: 25em;
}
</style>