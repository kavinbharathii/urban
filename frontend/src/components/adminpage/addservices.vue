
<script>

import { db, db_rt } from "@/views/firebase.js"
import { get, ref } from "@firebase/database";
import { setDoc, doc, getDocs, getFirestore } from "firebase/firestore";

export default {
    data() {
        return {
            newServiceForm: {
                serviceName: "",
                categoryName: "",
                price: "",
                timing: ""
            },
            categories: [
                "Computer",
                "Laptop",
                "CCTV",
                "Printer",
                "UPS",
                "Electrician",
                "Plumbing"
            ],
            collections: [],
            successState: false,
            errorState: false
        }
    },
    methods: {

        // add a new service
        addNewService() {
            if (this.newServiceForm.serviceName == "" || this.newServiceForm.categoryName == "" ||
                this.price == "" || this.newServiceForm.timing == "") {
                console.log("Fill it properly da")
            } else {
                console.log(this.newServiceForm)
                setDoc(doc(db, this.newServiceForm.categoryName.category + '/' + this.newServiceForm.serviceName), {
                    rupee: this.newServiceForm.price,
                    timing: this.newServiceForm.timing
                }).then(() => {

                    for (let i in this.newServiceForm) {
                        this.newServiceForm[i] = ''
                    }
                    console.log("New service added successfully")
                    this.successState = true
                    this.errorState = false

                }).catch((err) => {
                    console.log(err)

                    this.errorState = true
                    this.successState = false
                })
            }
        },
    },

    async mounted() {
        const snapshot = await db.listCollections();
        snapshot.forEach(doc => {
            if (doc.path.split('/').length === 2) {
                this.collections.push(doc.path.split('/')[1]);
            }
        });
    }
}
</script>

<template>
    <div id="dev">
        <div class="circle"></div>
        <form id="serviceForm">
            <h1>Add new service</h1>
            <input type="text" placeholder="service name" v-model="this.newServiceForm.serviceName">

            <select required placeholder="select category" v-model="this.newServiceForm.categoryName">
                <option :value="{ category }" v-for="(category, index) in this.categories" :key="index">{{ category }}
                </option>
            </select>

            <input type="text" placeholder="timing" v-model="this.newServiceForm.timing">

            <input type="number" placeholder="price" v-model="this.newServiceForm.price">

            <button @click.prevent="addNewService" class="submit-button">Add Service</button>

            <div v-if="this.successState" class="info success">
                New service has been added successfully
            </div>

            <div v-if="this.errorState" class="info error">
                Failed to create new service
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

#serviceForm {
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

#serviceForm>input,
select {
    width: 100%;
    height: 2.8em;

    outline: none;
    border: 1px solid #c6c6c6;

    color: #171717;
    border-radius: 5px;
    padding: 0 1em 0 1em;
}

#serviceForm>.submit-button {
    background-color: var(--rose);

    transition: border 200ms ease;

    border: none;
    outline: none;
    width: 100%;
    padding: 0.3em 0.2em;
}

#serviceForm>.submit-button:hover {
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
    #serviceForm {
        width: 50vw;
    }

    .circle {
        width: 80vw;
        height: 80vw;
        border-radius: 0 0 100vh 0;
    }
}

@media only screen and (max-width: 600px) {
    #serviceForm {
        width: 100vw;
    }
}
</style>
