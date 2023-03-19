<script>

import { child, get} from "firebase/database";
import { auth , dbref_rt } from "../views/firebase.js"
import { onAuthStateChanged } from "firebase/auth";
import Router from '@/router'

export default {
    data() {
        return{
            loginemail : '',
            cartData: [],
            category: []
        }
    },
    components: {

    },
    mounted: function() {
        this.getuser()
    },
    methods: {

        async getUsercart(email) {
            await get(child(dbref_rt, email+'/' )).then((snapshot) => {
                if (snapshot.exists()) {
                    this.cartData.push(snapshot.val())
                    this.parsingof
                } else {
                    console.log("No data available");
                }
                }).catch((error) => {
                    console.error(error);
                });
        },
        getuser() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.email;
                    this.loginemail = uid.split('@')[0]
                    console.log(this.loginemail)
                    this.getUsercart(this.loginemail)
                } else {
                  console.log("Can't get user e-mail")
                  Router.push('/signup')
                }
            });
        },
        updateData ( servicename , quantity , rupee , timing )  {
            console.log(servicename , quantity , rupee , timing )
            try {
                console.log( this.email , this.categoryName , quantity , rupee , timing)
                let category = this.categoryName;
                console.log(category, servicename , quantity , rupee , timing )
                set(ref(db_rt, this.email + '/' + category+'/' + servicename), {
                    quantity: quantity,
                    rupee : rupee,
                    timing : timing,
                    booked : true
                });
                console.log('Added successfully')
                
            }
            catch (err) {
                console.log("error :", err)
            }
        }
    },
    computed: {
        parsingof() {
            for ( let i in this.cartData[0] ) {
                let catename = this.cartData[0][i]
                const keys = Object.keys(catename);
                let cate = 0
                for ( let j in keys ) {
                    cate += parseInt(this.cartData[0][i][keys[j]].rupee) * parseInt(this.cartData[0][i][keys[j]].quantity)              
                }
                this.category[i] = cate
            } 
            console.log(this.category)
        }
    }
}
</script>

<template>

    <div class="cart-page">
        <div class="cart-view">
            <div v-for="(data,index) in this.cartData" :key="index">
                <div v-for="(data1 , category) in data" :key="category">
                    <div class="category"> {{ category }}  services</div> 
                    <div v-for="(data2, sname) in data1" :key="sname" class="cards">
                        <div>
                            <div class="servicename">{{ sname }}</div>
                            <div class="rating"><strong>✩</strong> {{ data2.rating }} (456K Booking)</div>
                            <div class="rupee">
                                <strong>₹ {{ data2.rupee }}.00</strong>
                                <span> • {{ data2.timing }}</span>
                            </div>
                        </div>
                        <div>
                            <div class="add-btn">
                                <span @click="subtract()">-</span>
                                <div :id="'cart' + index" @click="updateData( category , data2.rupee , data2.timing )">{{ data2.quantity }}</div>
                                <span @click="addition() ">+</span>
                            </div>
                        </div>
                    </div>
                <div :id="'book' + category">BOOK</div>
                </div>
            </div>
        </div>

        <div class="cart-details"></div>
    </div>
</template>

<style scoped>

.cart-page {
    padding:0 10%;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.cart-view , .cart-details{
    height: 100vh ;
    padding: 2em;
}

.cards {
    padding: 1em;
    background-color: #f5f2f2;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
}

.category {
    font-size: 1.5em;
    display: flex;
    align-items: center;
    color: #fc3171bf;
    margin: 1em 0 .3em 0;
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


.add-btn {
    display: flex;
    gap: 0.5em;
    align-items: center;
    justify-content: space-between;
    margin: .4em .7em 0 0;
    background-color: hsla(341, 100%, 46%, 0.749);
    color: #fff;
    padding: 0.2em 0.5em;
    border-radius: 8px;
    min-width: 5em;
}

.add-btn span {
    color: #fff;
    cursor: pointer;
}

.add-btn button {
    border: none;
    color: #fff;
    background-color: #fc3171bf;
}

</style>

