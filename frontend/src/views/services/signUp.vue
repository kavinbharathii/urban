<script>

import { createUserWithEmailAndPassword , sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase.js'

export default {
    data() {
        return{
            form : { email: '' , password: '' },
        }
    },
    methods : {
        signup() {
            createUserWithEmailAndPassword(auth, this.form.email, this.form.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('login successfully')
                })
                .catch((error) => {
                    console.log(error)
                });
        },
        reset() {
            console.log('ok');
            const email = document.querySelector('.resetemail')
            console.log(email.value)
            sendPasswordResetEmail(auth , email.value) 
                .then(() => {
                    console.log('link send')
                })
                .catch((err) => { console.log(err) })
        }
    }


}
</script>

<template>
    <div>
        <form @submit.prevent="signup()">
            <label for="email">Email: <input type="text" v-model="form.email" required></label>
            <label for="password">Password: <input type="password" v-model="form.password" required></label>
            <button type="submit"> signup </button>
        </form>
        <div>
            <div><input type="email" class="resetemail"></div>
            <div><button @click="reset()">reset</button></div>
        </div>
    </div>
</template>