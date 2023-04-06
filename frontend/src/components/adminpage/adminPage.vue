
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

        <nav>

            <div class="title-card" v-if="!this.Loading">Admin Dashboard</div>

            <div class="nav-links" v-if="!this.Loading">
                <p class="nav-link">AddCategory</p>
                <p class="nav-link">AddServices</p>
                <p class="nav-link">EditServices</p>
            </div>
        </nav>

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
                                        <div @click="statusupdate(index1, index2, index3, index5, category)" class="status-update">
                                            update
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

#dev > nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100vw;
    height: 5em;
}

.nav-links {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
}

.nav-link {
    width: fit-content;
    margin: 1em;
    padding: 0.2em 0.5em;

    border-radius: 5px;
    border: 2px solid var(--rose);
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
    font-size: 01em;
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

.payment.yes {
    color: rgb(255, 0, 0);
}

.payment.no {
    color: green;
}
</style>
