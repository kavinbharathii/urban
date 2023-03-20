
<script>

import { db } from "@/views/firebase.js"
import { setDoc, doc, getDoc, getDocs, collection } from "@firebase/firestore";
import Router from '@/router'

export default {
    data() {
        return {
            newServiceForm: {
                serviceName: "",
                categoryName: "",
                price: "",
                timing: ""
            },
            editServiceForm: {
                serviceName: "",
                categoryName: "",
                price: "",
                timing: ""
            },

            categories: [
                "Computer",
                "CCTV"
            ],

            services: {}
        }
    },

    methods: {
        addNewService() {
            if (this.newServiceForm.serviceName == "" || this.newServiceForm.categoryName == "" ||
                this.price == "" || this.newServiceForm.timing == "") {
                console.log("Fill it properly da")
            } else {
                console.log(this.newServiceForm)
                setDoc(doc(db, this.newServiceForm.categoryName + '/' + this.newServiceForm.serviceName), {
                    rating: "10",
                    rupee: this.newServiceForm.price,
                    timing: this.newServiceForm.timing
                }).then(() => {
                    console.log("New service added successfully")
                }).catch((err) => {
                    console.log(err)
                })
            }
        },

        editService() {

        }
    },

    async mounted() {
        console.log("may jesus piss on you!")
        for (let category in this.categories) {
            const services = await getDocs(collection(db, category))
            console.log(services)
            services.forEach(doc => {
                console.log(doc.id)
            })
        }
        console.log("I hope it was warm")
    }
}

</script>

<template>
    <div id="dev">
        <form id="add-new-service">
            <h3>Add new service</h3>
            <label for="">
                Service Name:
                <input type="text" v-model="this.newServiceForm.serviceName">
            </label>

            <label for="">
                Category:
                <select required v-model="this.newServiceForm.categoryName">
                    <option value="Computer">Computer</option>
                    <option value="CCTV">CCTV</option>
                </select>
            </label>

            <label for="">
                Price:
                <input type="number" v-model="this.newServiceForm.price">
            </label>

            <label for="">
                Timing:
                <input type="text" v-model="this.newServiceForm.timing">
            </label>

            <button @click.prevent="addNewService">Add Service</button>
        </form>

        <!-- --------------------------------------- edit services --------------------------------------- -->
        <form action="" id="edit-services">
            <h3>Edit service</h3>

            <label for="">
                Category:
                <select required v-model="this.editServiceForm.categoryName">
                    <option value="Computer">Computer</option>
                    <option value="CCTV">CCTV</option>
                </select>
            </label>

            <label for="">
                Services:
                <select required :disabled="this.editServiceForm.categoryName == ''"
                    v-model="this.editServiceForm.serviceName">
                    <option value="Computer">Computer</option>
                    <option value="CCTV">CCTV</option>

                    <!-- <option value="" v-for=""></option> -->
                </select>
            </label>

            <label for="">
                Price:
                <input type="number" v-model="this.editServiceForm.price">
            </label>

            <label for="">
                Timing:
                <input type="text" v-model="this.editServiceForm.timing">
            </label>

            <button @click.prevent="editService">Add Service</button>
        </form>
    </div>
</template>

<style scoped>
#dev {
    width: 100vw;
    height: 100vh;
}

#add-new-service {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#edit-services {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
