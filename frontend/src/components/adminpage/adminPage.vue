
<script>

import { db_rt } from "@/views/firebase.js"
import { ref, onValue, set } from "@firebase/database";

export default {
    data() {
        return {
            bookedData: {},
            cartData: [],
            statusValue: '',
            Loading: true
        }
    },
    methods: {
        async getAllBookedItems() {
            const messagesRef = ref(db_rt, 'Booking');
            onValue(messagesRef, snapshot => {
                this.cartData = [];
                if (snapshot.exists()) {
                    this.cartData.push(snapshot.val())
                    this.Loading = false
                } else {
                    console.log("No data available");
                    this.Loading = false
                }
            })
            console.log(this.cartData)
        },

        prettyDates(dateString) {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"]

            const dateAdditions = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]

            let [date, month, year] = dateString.split('-')
            date = date + dateAdditions[parseInt(date[date.length - 1])]
            month = monthNames[parseInt(month) - 1]

            let prettyDateString = [date, month, year].join(" ")
            return prettyDateString
        },

        prettyTimes(timeString) {
            let [hours, minutes, seconds] = timeString.split(":")
            hours = parseInt(hours)
            let meridian = parseInt(hours) < 12 ? 'am' : 'pm'
            hours = (hours > 12) ? hours - 12 : hours

            // formatting the "0" hours at midnight time
            if (hours == 0) hours = 12

            minutes = minutes.padStart(2, '0')

            let timePart = [hours, minutes].join(":")
            let prettyTimeString = [timePart, meridian].join(" ")
            return prettyTimeString
        },

        statusupdate(username, date, time, category, categories) {
            console.log(username, date, time, category, categories)

            this.statusValue = 'status' + username + date + time + category
            let id = document.getElementById(this.statusValue)
            console.log(id.value)

            const checkBoxId = 'status' + username + date + time + category + 'checkBox'
            let checkBox = document.getElementById(checkBoxId)

            for (let i in categories) {

                set(ref(db_rt, 'Booking/' + username + '/' + date + '/' + time + '/' + 'services/' + category + '/' + i), {

                    booked: categories[i].booked,
                    paymentMethod: categories[i].paymentMethod,
                    quantity: categories[i].quantity,
                    rupee: categories[i].rupee,
                    timing: categories[i].timing,
                    status: id.value
                }).then(() => {
                    console.log('Added successfully')
                    checkBox.innerHTML = "<span class='material-symbols-outlined bold-green'>check_circle</span>"
                }).catch((err) => {
                    console.log("Error")
                })
            }
        }
    },
    async mounted() {
        this.getAllBookedItems()

        document.title = "Admin Page - Serve To All"
    }

}

</script>

<template>
    <div id="dev">
        <div>
            <button class="load-btn" v-if="this.Loading">
                <span class="spinner-border spinner-border-sm" style="color: white"></span>Loading...
            </button>
        </div>

        <div class="header" v-if="!this.Loading">
            <div class="logo">
                Admin Dashboard
            </div>
            <div>
                <nav class="nav-bar navbar navbar-expand-sm navbar-dark">
                    <div class="container">
                        <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse"
                            data-bs-target="#n_bar" aria-controls="navbarNavAltMarkup" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="n_bar">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <router-link to='/admin/addCategory'>
                                        <p class="nav-link">Add Category</p>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to='/admin/addservices'>
                                        <p class="nav-link">Add Services</p>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to='/admin/editservices'>
                                        <p class="nav-link">Edit Services</p>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>

        <div v-for="(bookedData, index0) in this.cartData" :key="index0">
            <div v-for="(userName, index1) in bookedData" :key="index1" class="user-card">
                <h1 class="username">{{ index1 }}</h1>

                <div v-for="(date, index2) in userName" :key="index2" class="order-card">
                    <div v-for="(time, index3) in date" :key="index3">
                        <div class="date-time-info">
                            <div>Date: {{ this.prettyDates(index2) }}</div>
                            <div>Time: {{ this.prettyTimes(index3) }}</div>
                        </div>

                        <div class="details-card">
                            <div class="all-categories">
                                <div v-for="(category, index5) in time.services" :key="index5" class="category">
                                    <div class="categoryname"> {{ index5 }} service </div>
                                    <div v-for="(services, index6) in category" :key="index6" class="services-cart">
                                        <div class="servicename">{{ index6 }}</div>
                                        <div class="services-detail">
                                            <div class="paymentstatus"
                                                :class="`payment ${services.quantity == 'Cash on delivery' ? 'no' : 'yes'} `">
                                                {{ services.paymentMethod }}
                                            </div>
                                            <div class="quantity">Quantity : {{ services.quantity }}</div>
                                            <div class="rupee">Price :{{ services.rupee }}</div>
                                        </div>
                                    </div>
                                    <div class="status-div">
                                        <div>Order status: </div>
                                        <div>
                                            <select :id="'status' + index1 + index2 + index3 + index5">
                                                <option value="Order Received">Order Received</option>
                                                <option value="Service in progress">Service in progress</option>
                                                <option value="Service completed">Service completed</option>
                                            </select>
                                        </div>
                                        <div @click="statusupdate(index1, index2, index3, index5, category)"
                                            class="status-update">
                                            update
                                        </div>
                                        <div class="updated-status" :id="'status' + index1 + index2 + index3 + index5 + 'checkBox'">
                                            <!-- <span class="material-symbols-outlined">
                                                check_circle
                                            </span> -->
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="address-card">
                                <h4 class="address-title">
                                    Ordered Address:
                                </h4>
                                <div class="address-line">{{ time.Address.username }}</div>
                                <div class="address-line">{{ time.Address.address_line_1 }}</div>
                                <div class="address-line">{{ time.Address.address_line_2 }}</div>
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

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.nav-bar {
    text-decoration: none;
    z-index: 100;
}


.header {
    margin-top: .3em;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.collapse {
    justify-content: end;
}

button {
    background-color: #171717;
}

.logo {
    font-size: 2em;
    margin-left: 1.5em;
    margin-top: .2em;
}

.nav-links {
    margin-right: 1.5em;

    display: flex;
    flex-direction: row;
    gap: 0.4em;
}

.nav-link {
    text-decoration: none;
    text-transform: uppercase;

    position: relative;
    z-index: 1;
    color: #171717;
    margin: 0 0.5em 0 0.5em;
}

.nav-link:hover {
    color: #171717;
}

.nav-link::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    bottom: 0;
    left: -0.25em;
    right: -0.25em;
    background-color: #fc3171bf;
    transform-origin: center right;
    transform: scaleX(0);
    transition: transform 0.2s ease-in-out;
}

.nav-link:hover::before {
    transform: scaleX(1);
    transform-origin: center left;
}


a {
    text-decoration: none;
}

.navbar-nav>li {
    display: flex;
    justify-content: right;
}

.logo-subtext {
    display: flex;
    font-size: 1.5em;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0;
    letter-spacing: 0.2em;
}

.title-card {
    margin-left: 2em;
    font-size: 2em;
}

.user-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    width: 80vw;
    margin-bottom: 1.5em;
}

.details-card {
    background-color: #f2f2f2;
    padding: 1em;

    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    margin-bottom: 2em;
}

.username {
    color: #171717;
    font-weight: 600;
    font-size: 1.5em;
    margin-left: 0.5em;
}

.date-time-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    padding-left: 1.5em;
    padding-right: 1.5em;


    background-color: #cecece;
    height: 3em;
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

.time {
    position: absolute;
    top: 0;
    left: 0;
}

.categoryname {
    font-size: 1.5em;
    color: var(--rose-dark);
}

.servicename {
    padding-left: 1.2em;
    font-size: 1.1em;
}

.address-card {
    width: 20vw;
}

.address-title {
    font-weight: 700;
}

.address-line {
    font-size: 1em;
    font-weight: 200;
}

.status-div {
    margin-top: 3.5em;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
}

.status-update {
    background-color: rgb(81 112 235);
    padding: 0 0.5em 0 0.5em;
    color: #ffffff;
}

.payment .yes {
    color: rgb(255, 0, 0);
}

.payment .no {
    color: green;
}

.bold-green {
    font-weight: 700;
    color: #4ade80;
}
</style>
