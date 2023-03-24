<script>

import { child, get} from "firebase/database";
import { dbref_rt } from '../views/firebase.js'

export default {
    data() {
        return{
            orderCart: [],
            ordered: [],
            categoryAmt: []
        }
    },
    props : {
        useremail : String
    },
    mounted: function() {
        this.getcartdata()
    },
    methods: { 
        async getcartdata() {
            await get(child(dbref_rt, 'Booking/' + this.useremail +'/' )).then((snapshot) => {
                this.ordered.push(snapshot.val())
                snapshot.forEach(childSnapshot => {
                    this.orderCart[childSnapshot.key] = childSnapshot.val()
                })
                })
                .then(() => {
                    console.log('calculate' , this.orderCart)
                    // this.getCalculate()
                })
                .catch((error) => {
                    console.error(error);
                });            
        },

        getCalculate() {
            
            for (let i in this.orderCart) {
                
                let keys = Object.keys(this.orderCart[i])
                let cate = 0
                for (let j in keys) {
                        cate += parseInt(this.orderCart[i][keys[j]].rupee) * parseInt(this.orderCart[i][keys[j]].quantity)
                }
                this.categoryAmt[i] = cate
            }   
            console.log(this.categoryAmt)
        }
    }
}   
</script>

<template>
    <div class="order-page">
        <div class="yr-order">Your Orders</div>
        <div class="cart-view">
            <div v-for="(data1, index) in this.ordered" :key="index">

                <div v-for="(data2 , index2) in data1" :key="index2"> date : {{ index2 }}
                    <div v-for="(data3 , index3) in data2" :key="index3"> time : {{ index3 }}
                        <div v-for="(data4 , index4) in data3.services" :key="index4"> {{index4}}
                            <div v-for="(data5 , index5) in data4" :key="index5" class="servicedetails"> <pre> {{index5}} </pre>
                                <div><pre>Price :   {{ data5.rupee }}</pre></div>
                                <div> <pre> quantity :  {{ data5.quantity }}</pre> </div>
                                <div><pre> timing :  {{ data5.timing }}</pre> </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div v-for="(data1, category) in data" :key="category" class="all-cards">
                    <div class="cart-amt"> 
                        <div class="category">{{ category }}</div>
                        <div class="tot-amt">TotalAmt: {{ this.categoryAmt[category] }}</div>
                    </div> 
                    <div v-for="(data2, sname) in data1" :key="sname" class="cards">
                        <div v-if="data2.booked" class="card">
                            <div class="servicename">Problem : {{ sname }}</div>
                            <div class="quantity">Quantity :{{ data2.quantity }}</div>
                            <div class="rupee">
                                <strong>Price : ₹ {{ parseInt(data2.rupee) * parseInt(data2.quantity) }}.00</strong>
                            </div>
                        </div>
                    </div>
                </div> -->

            </div>
        </div>
    </div>
</template>

<style scoped>

.yr-order {
    padding: 1em;
    background-color: #fc3171bf;
    color: #fff;
    font-size: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
}

.category {
    font-size: 1.5em;
    color: #fc3171bf;
}

.servicename {
    font-size: 1em;
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
.servicedetails {
    display: flex;
}

</style>