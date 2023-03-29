
<script>

import { db, db_rt } from "@/views/firebase.js"
import { get, ref , onValue } from "@firebase/database";
import { setDoc, doc, getDocs, collection } from "@firebase/firestore";

export default {
    data() {
        return {    
            bookedData: {},
            cartData: []
        }
    },
    methods: {
        async getAllBookedItems() {
            const messagesRef = ref(db_rt, 'Booking');
            onValue(messagesRef, snapshot => {
                this.cartData = [];
                if (snapshot.exists()) {
                    this.cartData.push(snapshot.val())
                } else {
                    console.log("No data available");
                }
            })
            console.log(this.cartData)
        },
    },
    async mounted() {
        this.getAllBookedItems()
    }

}

</script>

<template>
    <div id="dev">
    
        <!-- rendering booked data -->
        <div v-for="(bookedData, index0) in this.cartData" :key="index0">
            <div v-for="(userName, index1) in bookedData" :key="index1" class="user-card">
                <h1 class="Email">{{ index1 }}</h1>
                <div v-for="(date, index2) in userName" :key="index2" class="date-card">
                    <h2>{{ index2 }}</h2>
                    <div v-for="(time, index3) in date" :key="index3" class="time-card">
                        <div class="time"> <h3>{{ index3 }}</h3> </div>
                        <div class="address-card">
                            <div>
                               Ordered Address : 
                            </div>
                            <div>{{ time.Address.username }}</div>
                            <div>{{ time.Address.address_line_1 }}</div>
                            <div>{{ time.Address.address_line_2 }}</div>
                        </div>
                        <div class="all-categories">
                            <div v-for="(category , index5) in time.services" :key="index5" class="category">
                                <div class="categoryname"> {{ index5 }} service </div>
                                <div v-for="(services , index6) in category" :key="index6" class="services-cart"> 
                                    <div class="service-name">{{ index6 }}</div>
                                    <div class="services-detail">
                                        <div class="paymentstatus">{{ services.paymentMethod }}</div>
                                        <div class="quantity">Quantity : {{ services.quantity }}</div>
                                        <div class="rupee">Price :{{ services.rupee }}</div>
                                    </div>
                                </div>
                            <div>Status : </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
#dev {
    width: 100vw;
    height: 100vh;
}



#edit-services {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.user-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 10px;
    border: 1px solid #c5c5c5;
}

.date-card {
    display: flex;
    flex-direction: column;
    margin-bottom: 2em;
    background: #a9a9a9;
    padding: 2em;
}

.services-cart {
    display: flex;
    flex-direction: column;
    gap: .5em;
}

.services-detail {
    display: flex;
    gap: 1em;
    margin-left: 1em;
}

.time-card {
    display: flex;
    gap: 2em;
    flex-direction: row-reverse;
    align-items: flex-start;
    justify-content: space-between;

    position: relative;
    padding-top: 4em ;
    margin-bottom: 2em;
}

.time {
    position: absolute;
    top: 0;
    left: 0;
}

.category {
    display: flex;
    flex-direction: column;
    gap: 1em;
    margin-bottom: 1em;
}

</style>
