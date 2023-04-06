
<script>

import { db, db_rt } from "@/views/firebase.js"
import { get, ref } from "@firebase/database";
import { setDoc, doc, getDocs, collection } from "@firebase/firestore";

export default {
    data() {
        return {
            editServiceForm: {
                serviceName: "",
                categoryName: "",
                price: "",
                timing: ""
            },
            servicesData: {},

            categories: [
                "Computer",
                "Laptop",
                "CCTV",
                "Printer",
                "UPS",
                "Electrician",
                "Plumbing"
            ],

            successState: false,
            errorState: false,
            errorMsg: "Failed to edit service"
        }
    },
    methods: {

        // edit an existing service
        editService() {

            if (this.editServiceForm.categoryName == "" || this.editServiceForm.serviceName == "") {
                console.log("Invalid form")

                this.errorState = true
                this.successState = false
                this.errorMsg = "Invalid form inputs"

            } else {
                if (this.editServiceForm.price == "" || this.editServiceForm.timing == "") {
                    console.log("Nothing to change")

                    this.errorState = true
                    this.successState = false
                    this.errorMsg = "Nothing to change"
                } else {
                    setDoc(doc(db, this.editServiceForm.categoryName + '/' + this.editServiceForm.serviceName), {
                        rupee: this.editServiceForm.price,
                        timing: this.editServiceForm.timing
                    }).then(() => {
                        for (let i in this.editServiceForm) {
                            this.editServiceForm[i] = ''
                        }
                        console.log('edit successfully')
                        this.successState = true
                        this.errorState = false
                    }).catch((err) => {
                        console.log(err)

                        this.errorState = true
                        this.successState = false

                        this.errorMsg = "Failed to edit service"
                    })
                }
            }

            this.getServiceData()
        },

        // update queries of categories and services
        async getServiceData() {
            for (let category of this.categories) {
                const services = await getDocs(collection(db, category))
                this.servicesData[category] = []
                services.forEach(doc => {
                    // adding the services to the specific category
                    this.servicesData[category].push(doc.id)
                })
            }
        },

        async getAllBookedItems() {
            const bookedServices = await get(ref(db_rt, 'Booking'))
            const data = bookedServices.val()
            console.log(data)
            this.bookedData = data

            console.log(this.bookedData)
        },
    },
    async mounted() {
        this.getServiceData()
    }
}


</script>

<template>
    <div id="dev">
        <div class="circle"></div>
        <form id="editForm">
            <h3>Edit services</h3>

            <select required v-model="this.editServiceForm.categoryName">
                <option v-for="(category, index) in this.categories" :value="category" :key="index">{{ category }}</option>
            </select>

            <select required :disabled="this.editServiceForm.categoryName == ''" v-model="this.editServiceForm.serviceName">
                <option value=""></option>
                <option :value="servicesUnderCategory"
                    v-for="(servicesUnderCategory, index) in this.servicesData[this.editServiceForm.categoryName]"
                    :key="index">
                    {{ servicesUnderCategory }}
                </option>
            </select>

            <input placeholder="timing" type="text" v-model="this.editServiceForm.timing">

            <input placeholder="price" type="number" v-model="this.editServiceForm.price">

            <button @click.prevent="editService" class="submit-button">Edit Service</button>

            <div v-if="this.successState" class="info success">
                Successfully edited service
            </div>

            <div v-if="this.errorState" class="info error">
                {{ this.errorMsg }}
            </div>
        </form>
    </div>
</template>

<style scoped>
#dev {
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
}

.circle {
    position: absolute;
    top: 0;
    left: 0;

    width: 50vw;
    height: 50vw;
    border-radius: 0 0 50vw 0;

    background-color: var(--rose-light);
    z-index: -1;
}

#editForm {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    gap: 1em;
    width: 30vw;

    margin: 1em;
    padding: 1em;
    background-color: #fefefe;
    border-radius: 10px;
}

#editForm>input,
select {
    width: 100%;
    height: 2.8em;

    outline: none;
    border: 1px solid #c6c6c6;

    color: #171717;
    border-radius: 5px;
    padding: 0 1em 0 1em;
}

#editForm>.submit-button {
    background-color: var(--rose);

    transition: border 200ms ease;

    border: none;
    outline: none;
    width: 100%;
    padding: 0.3em 0.2em;
}

#editForm>.submit-button:hover {
    border: 3px solid var(--rose-dark);
}

.info {
    width: 100%;
    height: 2.8em;
    border-radius: 10px;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fefefe;
}

.success {
    color: #22c55e;
    border: 2px solid #22c55e;
}

.error {
    color: #fa5f54;
    border: 2px solid #fa5f54;
}

@media only screen and (max-width: 1000px) {
    #editForm {
        width: 50vw;
    }

    .circle {
        width: 80vw;
        height: 80vw;
        border-radius: 0 0 100vh 0;
    }
}

@media only screen and (max-width: 600px) {
    #editForm {
        width: 100vw;
    }
}
</style>