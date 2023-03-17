<script>

import { createUserWithEmailAndPassword , sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase.js'

export default {
    data() {
        return {
            form: {
                email: '',
                password: '',
                confirmpassword: ''
            },
        }
    },
    methods: {
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
    <div id="dev">
        <div class="padder">
            
        </div>
        <div class="former">
            <form @submit.prevent="signup()" class="signin-form">
                <h1>Hey there!👋</h1>
                <label for="email">Email<input type="text" v-model="form.email" required></label>
                <label for="password">Password<input type="password" v-model="form.password" required></label>
                <label for="confirm-password">Confirm Password<input type="password" v-model="form.confirmpassword" required></label>
                <div class="buttons">
                    <button type="submit" class="prominent">Create Account</button>
                    
                    <button type="button" class="secondary"><router-link to="/signin">Already an User?</router-link></button>
                    
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
#dev {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr;

    width: 100vw;
    height: 100vh;
}

.padder {
    width: 30vw;
    height: 100vh;
    background-color: #fc3171bf;
}

.former {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100vh;
}

.signin-form {
    display: flex;
    justify-content: center;
    flex-direction: column;

    gap: 1em;
    width: 70%;
    max-width: 25em;
}

label {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 10px;

    width: 100%;
}

.buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.buttons > button {
    width: 45%;
    outline: none;
    height: 2.5em;
    border-radius: 5px;
    border: 1px solid #fc3171bf;
}

.prominent {
    color: #fefefe;
    background-color: #fc3171bf;
}

.secondary {
    color: #171717;
    background-color: #fefefe;
    border: 1px solid #fc3171bf;
}


input {
    outline: none;
    padding: 0 .4em;
    height: 2em;
}

input:focus {
    border: 3px solid rgba(203, 153, 162,.8);
}

a {
    color: black;
}

</style>
