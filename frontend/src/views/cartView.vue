<script>

import { onAuthStateChanged } from "firebase/auth";
import { ref, set, onValue, remove } from "firebase/database";
import axios from "axios";

import { auth, db_rt } from "../views/firebase.js"
import Router from '@/router'

export default {
    data() {
        return {
            loginemail: '',
            actualEmail : '',
            emptyCart : false,
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
            bookingcart: [],
            time: '',
            currDate: '',
            booked: null,
            cartviewbutnotbooked: []
        }
    },
    components: {

    },
    mounted: function () {
        this.getuser()
        document.title = "Your Cart - Serve to All"
    },
    methods: {
        getuser() {

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.email;
                    this.actualEmail = user.email
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
                this.updateData(categoryname, servicename, quantity.innerHTML, rupee, timing, this.booked = false)
            }
            if (cal == 'sub') {
                quantity.innerHTML = parseInt(quantity.innerHTML) - 1
                if (quantity.innerHTML == 0) { quantity.innerHTML = 1 }
                this.updateData(categoryname, servicename, quantity.innerHTML, rupee, timing, this.booked = false)
            }
        },
        updateData(categoryname, servicename, quantity, rupee, timing, booked) {
            try {
                set(ref(db_rt, this.loginemail + '/' + categoryname + '/' + servicename), {
                    quantity: quantity,
                    rupee: rupee,
                    timing: timing,
                    booked: booked
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
                let notbookedcnt = 0
                for (let j in keys) {
                    if (this.datas[i][keys[j]].booked == false) {
                        cate += parseInt(this.datas[i][keys[j]].rupee) * parseInt(this.datas[i][keys[j]].quantity)
                        notbookedcnt += 1
                    }
                }
                this.cartviewbutnotbooked[i] = notbookedcnt
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
                    this.loading = false
                    this.emptyCart = true
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
            console.log(categoryname, servicename, 'deleting')
            const delRef = ref(db_rt, this.loginemail + '/' + categoryname + '/' + servicename)
            remove(delRef)
                .then(() => {
                    console.log('deleted successfully')
                })
                .catch((err) => { console.log("error : ", err) })
        },

        bookservice(category) {
            document.getElementById('id01').style.display = 'block'
            let bookcategory = [];
            bookcategory[category] = this.cartData[0][category]
            this.bookingcart['booked'] = bookcategory
        },

        bookallservice() {
            document.getElementById('id01').style.display = 'block'
            this.bookingcart['booked'] = this.cartData[0]
        },

        cashondelivery() {
            this.readyToPay = true
        },

        async payonline() {
            this.readyToPay = true
            let payed = await this.paymentMethod()
            
        },

        confirmBooking(confirmationType, paymentMethod ) {

            if (confirmationType == true) {
                console.log("Confirmed booking")

                this.readyToPay = false
                document.getElementById('id01').style.display = 'none'

                let currentDate = new Date();
                let cDay = currentDate.getDate()
                let cMonth = currentDate.getMonth() + 1
                let cYear = currentDate.getFullYear()
                this.time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
                this.currDate = cDay + '-' + cMonth + '-' + cYear;

                // save booking details to database

                console.log(this.bookingcart, 'BOOKED')

                for (let category in this.bookingcart['booked']) {
                    let categoryObject = this.bookingcart['booked'][category]
                    for (let service in categoryObject) {

                        this.writeinDb(category, service, categoryObject[service] , paymentMethod)
                        this.removeitemCart(category, service)
                    }
                }

                // address saving in DB
                try {
                    set(ref(db_rt, 'Booking' + '/' + this.loginemail + '/' + this.currDate + '/' + this.time + '/' + 'Address'), {
                        username: this.addressDetail.name,
                        address_line_1: this.addressDetail.address_line_1,
                        address_line_2: this.addressDetail.address_line_2
                    })
                    console.log('address saved')
                }
                catch (err) {
                    console.log('error', err)
                }
                // sending email
                this.SendingConfirmEmail()

                // popup message
                this.popupmessage()

            } else {
                console.log("Declined booking")
                this.readyToPay = false

                // declined payment -> Cash on Delivery
            }
        },

        writeinDb(category, service, categoryObject , paymentMethod ) {

            try {
                set(ref(db_rt, 'Booking/' + this.loginemail + '/' + this.currDate + '/' + this.time + '/' + 'services/' + category + '/' + service), {
                    timing: categoryObject.timing,
                    rupee: categoryObject.rupee,
                    quantity: categoryObject.quantity,
                    booked: true,
                    paymentMethod: paymentMethod,
                    status: 'pending'
                })
                console.log('category saved')
            }
            catch (err) {
                console.log("error :", err)
            }
        },

        async paymentMethod() {
            
            const response = await axios.post("http://127.0.0.1:3000/create-payment", {
                amount: 'this.amount',
                name: 'this.name',
                email: 'this.email',
            });

            const { orderId } = response.data;

            let options = {
                key: "rzp_test_HBni4PPnBF3Swj",
                amount: "100",
                currency: "INR",
                name: "IT Arena",
                order_id: orderId,
                handler: async (response) => {
                    try {
                        const paymentResponse = await axios.post(
                            "http://127.0.0.1:3000/verify-payment",
                            {
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: orderId,
                            razorpaySignature: response.razorpay_signature,
                            }
                        );

                        let signatureIsValid = paymentResponse.data
                        let paid = signatureIsValid.response.signatureIsValid 

                        if (paid) {
                            this.confirmBooking(true , 'Paid')
                        }
                        else {
                            console.log('Payment Pending')
                        }

                    } catch (err) {
                        console.error(err);
                    }
                },
            };
            var rzp1 = new Razorpay(options);

            rzp1.on('payment.failed', function (response) {

                alert('Bro yen Payment Cancel Panigaa')
                alert('response.error.code');
                alert('response.error.description');
                alert('response.error.source');
                alert('response.error.step');
                alert('response.error.reason');
                alert('response.error.metadata.order_id');
                alert('response.error.metadata.payment_id');
            });
            rzp1.open();
        },

        SendingConfirmEmail() {

            // Sending msg to the admin  mail
            let msgData = {
                username: this.addressDetail.name,
                ph_num : this.addressDetail.ph_num,
                address_line_1: this.addressDetail.address_line_1,
                address_line_2: this.addressDetail.address_line_2,
                email : this.actualEmail
            }
            console.log(msgData)
            axios.post(
                'http://127.0.0.1:3000/confirm-order',
                msgData
            ).then(response => {
                console.log(response.data)
            }).catch(error => {
                console.log(error)
            })
        },

        popupmessage() {
            document.getElementById('id02').style.display = 'block'
        },

        popupclose() {
            document.getElementById('id02').style.display = 'none'
        }
    }
}
</script>

<template>
    <div>
        <button class="load-btn" v-if="this.loading">
            <span class="spinner-border spinner-border-sm" style="color: white"></span>Loading...
        </button>

        <div>
            <header v-if="!this.loading" class="header">
                <div class="cart"><h1>Cart</h1><div class="action-button cart-btn"><span class="material-symbols-outlined">shopping_cart</span></div></div>
                <div class="yr-orders"><button><router-link :to="{ path: '/yourorders', query: { useremail: this.loginemail } }"> YourOrders</router-link></button>
                </div>
            </header>
        </div>

        <div v-if="this.emptyCart" class="emptyCart-div">
            <img src="/src/assets/emptyCart.svg" alt="Empty Cart">
            <div> Your Cart is Empty </div>
        </div>

        <div class="cart-page" v-if="!this.loading">
            <div class="cart-view">
                <div v-for="(data, index) in this.cartData" :key="index">
                    <div v-for="(data1, category) in data" :key="category" class="all-cards">
                        <div class="category" v-if="this.cartviewbutnotbooked[category] >= 1"> {{ category }} services</div>
                        <div v-for="(data2, sname) in data1" :key="sname">
                            <div class="book-data" v-if="!data2.booked">
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
                        </div>
                        <div :id="'book' + category" @click="bookservice(category)" class="w3-button book-btn"
                            v-if="this.cartviewbutnotbooked[category] >= 1">
                            <button>BOOK</button>
                        </div>
                    </div>
                    <div class="bookall w3-button book-btn" @click="bookallservice()" v-if="cartTotal > 1">Book all cart
                        services</div>
                </div>
            </div>

            <div class="cart-details" v-if="cartTotal > 1">
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
                            <div class="input-address-div">
                                <div class="address-header">Booking Address</div>
                                <input type="text" placeholder="Name" v-model="addressDetail.name" required autocomplete="off">
                                <input type="number" placeholder="Mobile number" v-model="addressDetail.ph_num" required autocomplete="off">
                                <input type="text" placeholder="address line 1" v-model="addressDetail.address_line_1" required autocomplete="off">
                                <input type="text" placeholder="address line 2" v-model="addressDetail.address_line_2" required autocomplete="off">
                                <div class="payment-btn">
                                    <button class="cod" @click="cashondelivery()">Cash on delivery</button>
                                    <button class="online_pay" @click="paymentMethod()">Online pay</button>
                                </div>
                            </div>
                        </div>
                        <div v-if="this.readyToPay" class="confirmation-dialog">
                            <h3>Please confirm your order</h3>
                            <div class="buttons">
                                <button class="confirm-button yes-button" @click="this.confirmBooking(true,'Cash on delivery')">Yes</button>
                                <button class="confirm-button no-button" @click="this.confirmBooking(false)">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="w3-container">
                <div id="id02" class="w3-modal">
                    <div class="w3-modal-content">
                        <div class="w3-container modal-container">
                            <span onclick="document.getElementById('id02').style.display='none'"
                                class="w3-button w3-display-topright">&times;</span>
                        </div>
                        <div>
                            <div class="popup"><h3> Successfully Booked </h3></div>
                            <div class="popup btn"><button @click="popupclose()">Ok</button></div>
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

/* Handle */
.cart-view::-webkit-scrollbar-thumb {
    background: #fa93b4bf;
}

/* Handle on hover */
.cart-view::-webkit-scrollbar-thumb:hover {
    background: #fc3171bf;
}

.header {
    display: flex;
    align-items: center;
}


.cart {
    width: 75%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    gap: 1em;
}

.cart span {
    margin-top: .60em;
}

.cart-page {
    padding: 1em 10% 0 10%;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.cart-view {
    overflow: scroll;
    padding: 0 2em 0 0;
    margin-top: 1em;
    overflow-x: hidden;
}

.all-cards {
    margin-bottom: 2em;
}

.cards {
    background-color: #f5f2f2;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    margin: 0.5em;
}

.book-data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1em;
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
    height: 100%;
    gap: 2em;
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
    min-height: auto !important;
    padding-bottom: 4em;
    border-radius: 10px;
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
    background-color: #e0dcdc;
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

.yr-orders {
    width: 25%;
    padding: 2em;
    margin-right: 2em;
}

.yr-orders button {
    background: none;
    outline: none;
    border: none;
    background-color: #fc3171bf;
    padding: .5em 1em;
}

.yr-orders button a {
    color: black;
}

.address-header {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #ee6a94bf;
    margin-bottom: 1em;
}

.input-address-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    margin-top: 2em;
}

.input-address-div input::placeholder {
    font-family: 'Poppins';
}

.input-address-div input {
    padding: .3em .75em;     
    outline: none;
    max-width: 30em ;
    width: 100%;
}

.payment-btn {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    max-width: 30em;
    gap: 1em;
}

.cod {
    border: 1px solid rgb(255, 61, 94);
    background: no-repeat;
    outline: none;
    color: rgb(233, 106, 127);
    padding: 0.5em 1em;
    width: 100%;
    max-width: 30em;
}

.online_pay {
    border: 1px solid rgb(97 101 187);
    background-color: rgb(81 112 235);
    outline: none;
    color: white;
    padding: 0.5em 1em;
    width: 100%;
    max-width: 30em;
}   

.cod:hover {
    background-color: hsla(341, 100%, 46%, 0.749);
    color: #fff;
}

.online_pay:hover {
    background-color: #fff;
    border: 1px solid rgb(97,101,187);
    color: blue;
}

.popup {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2em 0 0 0;
    border: none;
    outline: none;
}

.btn button {
    border: none;
    outline: none;
    background: none;
    background-color: #04c484;
    padding: 0.3em 1em;
    border-radius: 10px;
    outline: none;
}

.emptyCart-div {
    display: flex;
    flex-direction: column;
    gap: 3em;
    align-items: center;
    justify-content: center;
    padding-top: 5em;
}

.emptyCart-div div {
    font-size: 2em;
    color: #fc3171bf;
}

.emptyCart-div img {
    width: 400px;
}

@media only screen and (max-width: 768px) {
    .cart-page {
        display: flex;
        flex-direction: column-reverse;
        row-gap: 2em;
        padding: 0 2em;
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
    .w3-modal-content {
        width: 95% !important;
    }
}

</style>
