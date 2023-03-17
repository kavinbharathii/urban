<script>

import { createUserWithEmailAndPassword } from 'firebase/auth';
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
    </div>
</template>