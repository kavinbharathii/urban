<script>

import { onAuthStateChanged } from "firebase/auth";
import { ref, set, onValue, remove } from "firebase/database";

import { auth, db_rt } from "../views/firebase.js"
import Router from '@/router'

export default {
    data() {
        return {
            loginemail: '',
            cartData: [],
            category: null,
            datas: [],
            cartTotal: 0,
            loading: true,
            addressDetail: {
                name: null,
                ph_num: null,
                address_line_1: null,
                address_line_2: null
            },
            readyToPay: false,
            bookingcart: []
        }
    },
    components: {

    },
    mounted: function () {
        this.getuser()
    },
    methods: {
        getuser() {

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.email;
                    let email_username = uid.split('@')[0]
                    this.loginemail = email_username.replaceAll(".", "")
                    this.changeCartRupee(this.loginemail)
                } else {
                    console.log("Can't get user e-mail")
                    Router.push('/signup')
                }
            });
        },
        updateof(categoryname, servicename, rupee, timing, cal) {

            let quantity = document.querySelector('#cart' + servicename.split(' ').join(''))
            if (cal == 'add') {
                quantity.innerHTML = parseInt(quantity.innerHTML) + 1
                this.updateData(categoryname, servicename, quantity.innerHTML, rupee, timing)
            }
            if (cal == 'sub') {
                quantity.innerHTML = parseInt(quantity.innerHTML) - 1
                if (quantity.innerHTML == 0) { quantity.innerHTML = 1 }
                this.updateData(categoryname, servicename, quantity.innerHTML, rupee, timing)
            }
        },
        updateData(categoryname, servicename, quantity, rupee, timing) {
            try {
                set(ref(db_rt, this.loginemail + '/' + categoryname + '/' + servicename), {
                    quantity: quantity,
                    rupee: rupee,
                    timing: timing,
                    booked: true
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
            for (let i in this.datas) {
                const keys = Object.keys(this.datas[i])
                let cate = 0
                for (let j in keys) {
                    cate += parseInt(this.datas[i][keys[j]].rupee) * parseInt(this.datas[i][keys[j]].quantity)
                }
                this.cartTotal += cate
                this.category[i] = cate

            }
        },
        changeCartRupee() {
            const messagesRef = ref(db_rt, this.loginemail + '/');
            onValue(messagesRef, snapshot => {
                this.category = [];
                this.cartData = [];
                if (snapshot.exists()) {
                    this.category = Object.keys(snapshot.val())
                    this.cartData.push(snapshot.val())
                    this.loading = false
                } else {
                    console.log("No data available");
                }
            })
            onValue(messagesRef, snapshot => {
                this.datas = [];
                snapshot.forEach(childSnapshot => {
                    const message = childSnapshot.val();
                    this.datas[childSnapshot.key] = childSnapshot.val()
                })
                this.parsingof()
            });

        },

        removeitemCart(categoryname, servicename) {
            console.log(categoryname, servicename)
            const delRef = ref(db_rt, this.loginemail + '/' + categoryname + '/' + servicename)
            remove(delRef)
                .then(() => {
                    console.log('deleted successfully')
                })
                .catch((err) => { console.log("error : ", err) })
        },

        bookservice(category) {
            document.getElementById('id01').style.display='block'
            let bookcategory = [];
            bookcategory[category] = this.cartData[0][category]
            this.bookingcart['booked'] = bookcategory
            console.log(this.bookingcart)
        },

        bookallservice() {
            document.getElementById('id01').style.display='block'
            this.bookingcart['booked'] = this.cartData[0]
            console.log(this.bookingcart)
        },

        cashondelivery() {
            this.readyToPay = true
        },

        confirmBooking(confirmationType) {
            if (confirmationType == true) {
                console.log("Confirmed booking")
                console.log(this.addressDetail)

                this.readyToPay = false
                document.getElementById('id01').style.display = 'none'


                // save booking details to database

            } else {
                console.log("Declined booking")
                this.readyToPay = false

                // declined payment -> Cash on Delivery
            }
        }
    },
}
</script>

<template>
    <div>
        <button class="load-btn" v-if="this.loading">
            <span class="spinner-border spinner-border-sm" style="color: white"></span>Loading...
        </button>

        <div class="cart-page" v-if="!this.loading">
            <div class="cart-view">
                <div v-for="(data, index) in this.cartData" :key="index">
                    <div v-for="(data1, category) in data" :key="category" class="all-cards">
                        <div class="category"> {{ category }} services</div>
                        <div v-for="(data2, sname) in data1" :key="sname" class="cards">
                            <div>
                                <div class="servicename">{{ sname }}</div>
                                <div class="rating"><strong>✩</strong> {{ data2.rating }} (456K Booking)</div>
                                <div class="rupee">
                                    <strong>₹ {{ data2.rupee }}.00</strong>
                                    <span> • {{ data2.timing }}</span>
                                </div>
                            </div>
                            <div class="add-remove-btn">
                                <div class="remove-btn">
                                    <div @click="removeitemCart(category, sname)"><button>Remove</button></div>
                                </div>
                                <div class="add-btn">
                                    <span @click="updateof(category, sname, data2.rupee, data2.timing, 'sub')">-</span>
                                    <div :id="'cart' + sname.split(' ').join('')">{{ data2.quantity }}</div>
                                    <span @click="updateof(category, sname, data2.rupee, data2.timing, 'add')">+</span>
                                </div>
                            </div>
                        </div>
                        <div :id="'book' + category" @click="bookservice(category)" class="w3-button book-btn">
                            <button>BOOK</button>
                        </div>
                    </div>
                    <div class="bookall w3-button book-btn" @click="bookallservice()">Book all cart services</div>
                </div>
            </div>

            <div class="cart-details">
                <h3>Cart Summary</h3>
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

        <div>
            <div class="w3-container">
                <div id="id01" class="w3-modal">
                    <div class="w3-modal-content">
                        <div class="w3-container modal-container">
                            <span onclick="document.getElementById('id01').style.display='none'"
                                class="w3-button w3-display-topright">&times;</span>
                            <div>
                                <input type="text" placeholder="Name" v-model="addressDetail.name">
                                <input type="number" placeholder="Mobile number" v-model="addressDetail.ph_num">
                                <input type="text" placeholder="address line 1" v-model="addressDetail.address_line_1">
                                <input type="text" placeholder="address line 2" v-model="addressDetail.address_line_2">
                                <button class="cod" @click="cashondelivery()">Cash on delivery</button>
                                <button class="online_pay">Online pay</button>
                            </div>
                        </div>
                        <div v-if="this.readyToPay" class="confirmation-dialog">
                            <h3>Please confirm your order</h3>
                            <div class="buttons">
                                <button class="confirm-button yes-button" @click="this.confirmBooking(true)">Yes</button>
                                <button class="confirm-button no-button" @click="this.confirmBooking(false)">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>

    </div>
</template>

<style scoped>
.load-btn {
    margin-top: 2em;
}

.cart-view::-webkit-scrollbar {
    width: 10px;
}

/* Track */
.cart-view::-webkit-scrollbar-track {
    background: #f1f1f1;
}

/* Handle */
.cart-view::-webkit-scrollbar-thumb {
    background: #fa93b4bf;
}

/* Handle on hover */
.cart-view::-webkit-scrollbar-thumb:hover {
    background: #fc3171bf;
}

.cart-page {
    padding: 4em 10% 0 10%;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.cart-view {
    height: 80vh;
    overflow: scroll;
    padding: 0 2em 0 0;
    margin-top: 1em;
    overflow-x: hidden;
}

.all-cards {
    margin-bottom: 2em;
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
    margin: 0em 0 .75em 0;
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

.add-remove-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

.remove-btn {
    background: none;
}

.remove-btn button {
    background: none;
    outline: none;
    border: none;
    color: red;
}

.add-btn {
    display: flex;
    gap: 0.5em;
    align-items: center;
    justify-content: space-between;
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

.book-btn {
    display: flex;
    align-items: center;
    justify-content: end;
}

.book-btn:hover {
    background: none !important;
}

.book-btn button {
    background: none;
    border: none;
    outline: none;
    padding: .4em 1em;
    background-color: #fa93b4bf;
}

.cart-details {
    background: #f0f0f0;
    margin: 1em 0 auto 0;
    border-radius: 10px;
    height: auto;
    padding: 2em;
    margin-left: 2em;
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

.w3-modal-content {
    width: 50vw !important;
    min-height: 70vh !important;
}

.bookall {
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    padding: 0.75em 1em;
    background-color: pink;
    cursor: pointer;
}

.modal-container {
    width: 100% !important;
    height: 100% !important;
}

.confirmation-dialog {
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: #17171755;

    position: absolute;
    top: 0;
    left: 0;

    color: #171717;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.buttons {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
    width: 50%;
}

.confirm-button {
    background: none;
    border-radius: 5px !important;
    width: 30% !important;
    padding: 2px 0.8em;
}

.yes-button {
    border: 3px solid #04c484;
    background-color: #21c18b;
}

.no-button {
    border: 3px solid #f22b2b;
    background-color: #b5392c;
}

@media only screen and (max-width: 768px) {
    .cart-page {
        display: flex;
        flex-direction: column-reverse;
        row-gap: 2em;
        padding: 2em;
    }

    *.cart-view::-webkit-scrollbar {
        display: none;
    }

    .cart-view {
        height: auto;
        padding: 0;
    }

    .cart-details {
        margin-left: 0;
    }
}
</style>
