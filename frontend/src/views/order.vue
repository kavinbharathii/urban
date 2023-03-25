<script>

import { child, get} from "firebase/database";
import { dbref_rt } from '../views/firebase.js'

export default {
    data() {
        return{
            orderCart: [],
            ordered: [],
            categoryAmt: [],
            Loading : true
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
                    this.Loading = false
                })
                })
                .then(() => {
                    // console.log( this.orderCart)
                })
                .catch((error) => {
                    console.error(error);
                });            
        },
        totalbookedamount( data ) {
            
            let amt = 0
            for ( let i in data ) {
                amt += parseInt(data[i].rupee) * parseInt(data[i].quantity)
            }
            return amt
        }
    },
}   
</script>

<template>
    <div class="order-page">

        <div class="yr-order">Your Orders</div>

        <div>
            <button class="load-btn" v-if="this.Loading">
                <span class="spinner-border spinner-border-sm" style="color: white"></span>Loading...
            </button>
        </div>

        <div class="cart-view" v-if="!this.Loading">
            <div v-for="(data1, index) in this.ordered" :key="index">

                <div v-for="(data2 , index2) in data1" :key="index2" class="all-carts">

                    <div v-for="(data3 , index3) in data2" :key="index3" class="order-cart">  
                        <div class="date-time">
                            <div class="date">Date : {{ index2 }}</div>
                            <div class="time">Time : {{ index3 }}</div>
                        </div>
                        <div v-for="(data4 , index4) in data3.services" :key="index4" class="service-cart">
                            <div>
                                <div class="service-name"> 
                                    {{index4}}
                                    <pre> ({{ Object.keys(data4).length }}) item </pre> 
                                </div>
                            </div>
                            <div v-for="(data5 , index5) in data4" :key="index5">
                                    <div class="name-amt"> 
                                        <div> <pre> <span style="color: pink"> • </span> {{index5}} </pre> </div>
                                        <div :id="'amt'+ index2.split(' ').join('') + index3.split(' ').join('')"> ₹ {{ parseInt(data5.rupee) * parseInt(data5.quantity) }} </div>
                                    </div>
                                    <div class="service-detail">
                                        <div><pre>Price : {{ data5.rupee }}   </pre></div>
                                        <div><pre>quantity : {{ data5.quantity }}   </pre> </div>
                                        <div><pre>timing : {{ data5.timing }}</pre> </div>
                                    </div>
                            </div>
                            <div class="status">Status  :  </div>
                            <div class="totAmt"> <pre> Total Price : {{ totalbookedamount(data4) }} </pre> </div>
                        </div>
                    </div>
                </div>
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

.load-btn {
    margin-top: 2em;
}

.cart-view {
    padding: 2em 4em;
}

.all-carts
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.order-cart {
    display: flex;
    flex-direction: column;
    gap: 1em;
    margin-bottom: 2em;
    background-color: #f2f2f2;
    border-radius: 10px;
    width: 100%;
    max-width: 70em;
}

.date-time {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    background-color: #d7d7d7;
    padding: 1em 2em;
}

.service-cart {
    padding: 0 2em;
    margin-bottom: 1em;
    position: relative;
}

.service-name {
    display: flex;
}

.name-amt {
    display: flex;
    justify-content: space-between;
}

.service-detail {
    display: flex;
    flex-wrap: wrap;
    padding: 0 0 0 0.5em;
}

.status {
    color: #ff788f;
    font-size: 1.5em;

}

.totAmt {
    position: absolute;
    top: 0;
    right: 23px;
}


@media only screen and (max-width: 786px) {
    .cart-view {
        padding: 1em;
    }
    .date-time {
        padding: 1em;
    }
    .service-cart {
        padding: 0 1em;
    }
    .totAmt {
        right: 8px;
    }
    .service-detail {
        padding: 0 0 0 4em;
    }
}

</style>