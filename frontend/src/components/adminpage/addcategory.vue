
<script>

import { db } from "@/views/firebase.js"
import { setDoc, doc } from "@firebase/firestore";

export default {
    data() {
        return {
            addNewCategory: {
                collectionName: "",
                serviceName: "",
                price: "",
                timing: "",
                successState: false,
                errorState: false
            },
        }
    },
    methods: {

        // add new category 
        async createNewCollection() {

            const collectionName = this.addNewCategory.collectionName;
            const newDocID = this.addNewCategory.serviceName;
            const newData = { rupee: this.addNewCategory.price, timing: this.addNewCategory.timing };
            const newDocRef = doc(db, collectionName, newDocID);

            this.successState = false
            this.errorState = false

            await setDoc(newDocRef, newData)
                .then(() => {
                    console.log('added successfully')
                    this.successState = true
                    this.errorState = false
                    for (let i in this.addNewCategory) {
                        this.addNewCategory[i] = ''
                    }
                })
                .catch((err) => {
                    console.log('Error :', err)
                    this.errorState = true
                    this.successState = false
                })
        }
    }
}
</script>

<template>
    <div id="dev">
        <div class="circle"></div>
        <form @submit.prevent="createNewCollection()" id="categoryForm">
            <h1>Add New Category</h1>
            <input type="text" placeholder="categoryname" v-model="addNewCategory.collectionName">
            <input type="text" placeholder="servicename" v-model="addNewCategory.serviceName">
            <input type="text" placeholder="timing" v-model="addNewCategory.timing">
            <input type="number" placeholder="rupee" v-model="addNewCategory.price">
            <input type="submit" class="submit-button">

            <div v-if="this.successState" class="info success">
                Category added successfully
            </div>

            <div v-if="this.errorState" class="info error">
                Failed to add Category
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

#categoryForm {
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

#categoryForm>input {
    width: 100%;
    height: 2.8em;

    outline: none;
    border: 1px solid #c6c6c6;

    color: #171717;
    border-radius: 5px;
    padding: 0 1em 0 1em;
}

#categoryForm>.submit-button {
    background-color: var(--rose);

    transition: border 200ms ease;
}

#categoryForm>.submit-button:hover {
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
    #categoryForm {
        width: 50vw;
    }

    .circle {
        width: 80vw;
        height: 80vw;
        border-radius: 0 0 100vh 0;
    }
}

@media only screen and (max-width: 600px) {
    #categoryForm {
        width: 100vw;
    }
}
</style>
