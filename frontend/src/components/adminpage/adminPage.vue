
<script>

import { db, db_rt } from "@/views/firebase.js"
import { get, ref, onValue } from "@firebase/database";
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
        }
    },
    async mounted() {
        this.getAllBookedItems()
    }

}

</script>

<template>
    <div id="dev">

        <nav>
            <h1 class="title-card">Admin Dashboard</h1>

            <div class="nav-links">
                <p class="nav-link">Add Category</p>
                <p class="nav-link">Add Services</p>
                <p class="nav-link">Edit Services</p>
            </div>
        </nav>

        <div v-for="(bookedData, index0) in this.cartData" :key="index0">
            <div v-for="(userName, index1) in bookedData" :key="index1" class="user-card">
                <h1 class="username">{{ index1 }}</h1>
                <div v-for="(date, index2) in userName" :key="index2" class="date-card">
                    <h2 class="dateClass">
                        <div class="date-circle"></div>    
                        {{ this.prettyDates(index2) }}
                    </h2>
                    <div v-for="(time, index3) in date" :key="index3" class="time-card">
                        <div class="time">
                            <h5 class="timeClass">{{ this.prettyTimes(index3) }}</h5>
                        </div>
                        <div class="address-card">
                            <h4 class="address-title">
                                Ordered Address:
                            </h4>
                            <div class="address-line">{{ time.Address.username }}</div>
                            <div class="address-line">{{ time.Address.address_line_1 }}</div>
                            <div class="address-line">{{ time.Address.address_line_2 }}</div>
                        </div>
                        <div class="all-categories">
                            <div v-for="(category, index5) in time.services" :key="index5" class="category">
                                <div class="categoryname"> {{ index5 }} service </div>
                                <div v-for="(services, index6) in category" :key="index6" class="services-cart">
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
}

.nav-links {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
}

.nav-link {
    width: fit-content;
}

.title-card {
    margin-top: 1em;
    margin-left: 2em;

    width: 100%;
    font-weight: 700;
}

.user-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;

    border-left: 3px solid var(--rose);

    width: 90vw;
    margin-bottom: 1.5em;
}

.date-card {
    display: flex;
    flex-direction: column;
    margin-bottom: 2em;
    /* background: #a9a9a9; */
    padding: 2em;

    position: relative;
}

.date-circle {
    width: 15px;
    height: 15px;
    border-radius: 100vh;

    background-color: var(--rose);
    position: absolute;

    top: 1.8em;
    left: -0.3em;
}

.dateClass {
    font-weight: 500;
}

.timeClass {
    font-weight: 500;
    margin: 0;
    padding: 0;

    border-bottom: 3px solid var(--rose);
}

.username {
    color: #171717;
    font-weight: 600;
    margin-left: 0.5em;
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
    padding-top: 4em;
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
</style>
