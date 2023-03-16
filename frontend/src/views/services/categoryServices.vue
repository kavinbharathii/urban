<script>

import { db } from '../firebase.js'
import { collection, getDocs } from "firebase/firestore";
import serviceNavbar from './serviceNavbar.vue';

export default {
    name : "categoryServices",
    components: {
        serviceNavbar
    },
    props: {
        categoryName: String 
    },
    data() {
        return {
            serviceName: [],
            providedServices: [],
            Loading: true
        }
    },
    mounted: function () {
        this.getData()
    },
    methods: {
        async getData() {

            const querySnapshot = await getDocs(collection(db, this.categoryName));
            querySnapshot.forEach((doc) => {
                this.serviceName.push(doc.id)
                this.providedServices.push(Object(doc.data()))
            });

            this.Loading = false
        },
    }
}
</script>

<template>
    <serviceNavbar />
    <div class="main">
        <div class="name-img">
            <div class="name">
                <div class="ser-name"> {{ this.categoryName }} Services </div>
                <div> <strong>✩</strong> 4.86 (456K Booking)</div>
            </div>
            <div>
                <img src="./images/computer.png" alt="com">
            </div>
        </div>
        <div class="lin"></div>

        <button class="load-btn" v-if="this.Loading">
            <span class="spinner-border spinner-border-sm" style="color: white"></span>Loading..
        </button>


        <h3 v-if="!this.Loading">Provided Services with Pricing</h3>
        <div class="all-cards" v-if="!this.Loading">

            <div class="cards" v-for="(data, id) in this.providedServices" :key="id">
                <div class="detail">
                    <div class="servicename">{{ this.serviceName[id] }}</div>
                    <div class="rating"><strong>✩</strong> {{ data.rating }} (456K Booking)</div>
                    <div class="rupee">
                        <strong>₹ {{ data.rupee }}.00</strong>
                        <span> • {{ data.timing }}</span>
                    </div>
                </div>
            </div>

            <div class="free"></div>
        </div>

    </div>
</template>

<style scoped>
* {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, "Helvetica Neue", Oxygen-Sans, Ubuntu, Cantarell, Helvetica, Arial, sans-serif !important
}

.name-img {
    padding: 5em 15%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.name .ser-name {
    font-size: 36px;
    font-weight: 700;
    line-height: 48px;
}


.lin {
    width: 65%;
    background-color: #d4d4d4;
    height: 0.3em;
    margin: 0 15%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4em;
}

h3 {
    padding: 0 15%;
    margin-bottom: 2em;
}

.all-cards {
    padding: 0 15%;
    display: flex;
    flex-direction: column;
    row-gap: 2em;
}

.view-btn {
    background: none;
    outline: none;
    border: none;
    padding: 0;
    color: #fc3171bf;
}

.cards {
    padding: 1em;
    background-color: #f5f2f2;
    border-radius: 10px;
}

.free {
    width: 100%;
    height: 2em;
}

.load-btn {
  color: white;
  padding: .5em 1em;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 1em;
  justify-content: space-between;
  border: none;
  outline: none;
  background-color: #fc3171bf;
}

.servicename {
    font-size: 2em;
    font-weight: 600;
}

.rating {
    margin-bottom: 1.3em;
    font-size: 0.8em;
}

.rupee {
    display: flex;
    gap: 1em;
    margin-bottom: 1em;
}

</style>
