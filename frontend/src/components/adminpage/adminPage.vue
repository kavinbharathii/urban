
<script>

import { db, db_rt } from "@/views/firebase.js"
import { get, ref } from "@firebase/database";
import { setDoc, doc, getDocs, collection } from "@firebase/firestore";


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
            addNewCategory: {
                collectionName: "",
                serviceName: "",
                price: "",
                timing: ""
            },

            categories: [
                "Computer",
                "CCTV"
            ],

            servicesData: {},
            bookedData: {}
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

            this.getServiceData()
        },

        // edit an existing service
        editService() {

            if (this.editServiceForm.categoryName == "" || this.editServiceForm.serviceName == "") {
                console.log("Invalid form")
            } else {
                if (this.editServiceForm.price == "" || this.editServiceForm.timing == "") {
                    console.log("Nothing to change")
                } else {
                    setDoc(doc(db, this.editServiceForm.categoryName + '/' + this.editServiceForm.serviceName), {
                        rating: "10",
                        rupee: this.editServiceForm.price,
                        timing: this.editServiceForm.timing
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

        // add new collection 
        async createNewCollection() {
            console.log(this.addNewCategory)
            const collectionName = this.addNewCategory.collectionName;
            const newDocID = this.addNewCategory.serviceName;
            const newData = { rupee: this.addNewCategory.price, timing: this.addNewCategory.timing };
            const newDocRef = doc(db, collectionName, newDocID);

            await setDoc(newDocRef, newData);
            console.log("Add successfully");
        },

        async getAllBookedItems() {
            const bookedServices = await get(ref(db_rt, 'Booked'))
            const data = bookedServices.val()
            this.bookedData = data
        },
    },

    // query data in mount
    async mounted() {
        this.getServiceData()

        this.getAllBookedItems()
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
                    <option value=""></option>
                    <option :value="servicesUnderCategory"
                        v-for="(servicesUnderCategory, index) in this.servicesData[this.editServiceForm.categoryName]"
                        :key="index">
                        {{ servicesUnderCategory }}
                    </option>
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

            <button @click.prevent="editService">Edit Service</button>
        </form>

        <!-- add new services -->

        <div>
            <form>
                <input type="text" placeholder="categoryname" v-model="addNewCategory.collectionName">
                <input type="text" placeholder="servicename" v-model="addNewCategory.serviceName">
                <input type="text" placeholder="timing" v-model="addNewCategory.timing">
                <input type="number" placeholder="rupee" v-model="addNewCategory.price">

            </form>
            <button @click="createNewCollection()">ADD collection</button>
        </div>

        <div v-for="(userName, index1) in this.bookedData" :key="index1">
            <h1>{{ index1 }}</h1>
            <div v-for="(date, index2) in userName" :key="index2">
                <h2>{{ index2 }}</h2>
                <div v-for="(time, index3) in date" :key="index3">
                    <h3>{{ index3 }}</h3>
                    <div v-for="(categories, index4) in time" :key="index4">
                        <h4>{{ index4 }}</h4>
                        <div v-for="(services, index5) in categories" :key="index5">
                            <h5>{{ index5 }}</h5>
                            <div v-for="(servicetype, index6) in services" :key="index6">
                                <h6>{{ index6 }}</h6>
                                <div v-for="(prop, index7) in servicetype" :key="index7">
                                    {{ index7 }}
                                </div>
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
