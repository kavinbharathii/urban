<script>

import { child, get} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { ref, set , onValue } from "firebase/database";

import { auth , dbref_rt , db_rt } from "../views/firebase.js"
import Router from '@/router'

export default {
    data() {
        return{
            loginemail : '',
            cartData: [],
            category: [],
            datas: [],
            cartTotal: 0,
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

                    for (let i in this.cartData[0]) {
                        this.category.push(i)
                    }
                    console.log(this.category)

                } else {
                    console.log("No data available");
                }
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getuser() {

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.email;
                    let email_username = uid.split('@')[0]
                    this.loginemail = email_username.replaceAll(".", "")
                    this.getUsercart(this.loginemail)
                    this.nakk(this.loginemail)
                } else {
                  console.log("Can't get user e-mail")
                  Router.push('/signup')
                }
            });
        },
        updateof ( categoryname , servicename , rupee , timing , cal)  {

            let quantity = document.querySelector('#cart'+servicename.split(' ').join(''))
            if (cal == 'add') {
                quantity.innerHTML = parseInt(quantity.innerHTML) + 1 
                this.updateData(categoryname , servicename ,quantity.innerHTML ,  rupee , timing )
            }
            if ( cal == 'sub') {
                quantity.innerHTML = parseInt(quantity.innerHTML) - 1
                if (quantity.innerHTML == 0 ) { quantity.innerHTML = 1 }
                this.updateData(categoryname , servicename ,quantity.innerHTML ,  rupee , timing )
            }
        },
        updateData(categoryname , servicename ,quantity ,  rupee , timing) {
            try {
                set(ref(db_rt, this.loginemail + '/' + categoryname+'/' + servicename), {
                    quantity: quantity,
                    rupee : rupee,
                    timing : timing,
                    booked : true
                }).then(() => {
                    console.log('Added successfully')
                })
            }
            catch (err) {
                console.log("error :", err)
            }
        },
        parsingof() {
            this.cartTotal = 0
            for ( let i in this.datas ) {
                const keys = Object.keys(this.datas[i])
                let cate = 0
                for ( let j in keys ) {
                    cate += parseInt(this.datas[i][keys[j]].rupee) * parseInt(this.datas[i][keys[j]].quantity)              
                }
                this.cartTotal += cate
                this.category[i] = cate
            }
        },
        nakk() {
                const messagesRef = ref(db_rt, this.loginemail+'/' );
                onValue(messagesRef, snapshot => {
                this.datas = [];
                snapshot.forEach(childSnapshot => {
                    const message = childSnapshot.val();
                    this.datas[childSnapshot.key] = childSnapshot.val()
                })              
                this.parsingof()
                });
            }         
    },

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
                                <span @click="updateof( category , sname , data2.rupee , data2.timing , 'sub' )">-</span>
                                <div :id="'cart' + sname.split(' ').join('')">{{ data2.quantity }}</div>
                                <span @click="updateof( category , sname , data2.rupee , data2.timing , 'add' )">+</span>
                            </div>
                        </div>
                    </div>
                <div :id="'book' + category">BOOK</div>
                </div>
            </div>
        </div>

       <div class="cart-details">
            <h3>Cart Details</h3>
            <div v-for="(item, index) in this.category" :key="index" class="cart-details-services">
                <div class="service-summary">
                    <div class="service-summary-name">{{ item }} </div>
                    <div class="service-summary-price">₹ {{ this.category[item] }}</div>
                </div>
            </div>
            <div class="cart-total">
                <div class="total-label">Total</div>
                <div class="total-value">₹ {{ cartTotal }}</div>
            </div>
        </div>
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
    margin: 0.5em;
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

.cart-details {
    background: #f0f0f0;
    margin: 3em;
    border-radius: 10px;
}

.cart-details-services {
    color: #171717;
    margin: 1em 0 1em 0;
    font-size: 0.8em;
}

.service-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.service-summary-price {
    color: #04c484;
}

.cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    font-size: 1.3em;
}
</style>

