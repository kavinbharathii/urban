
<script>

import { GoogleAuthProvider , signInWithPopup , onAuthStateChanged , signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.js'
import Router from '@/router'

export default {
    data() {
        return {
            form : { name:'' , email: '' , password: '' },
            err: ''
        }
    },
    methods: {
      loginWithGoogle() {
        const provider =  new GoogleAuthProvider();
        signInWithPopup( auth ,provider)
            .then((result)=>{
                console.log(result.user);
                Router.push('/cart')
                this.getUser()
            })
            .catch((error)=>{
                console.log('err' ,error)
            });
        },
        getUser() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.email;
                    this.email = uid.split('@')[0]
                    console.log(uid,this.email)
                } else {
                    console.log("Can't get user e-mail")
                    Router.push('/signup')
                }
            });
        },
        signin(){
			signInWithEmailAndPassword(auth, this.form.email, this.form.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('sigin successfully')
                })
                .catch((error) => {
                    console.log(error)
                    this.err = 'E-mail or Password is incorrect'
                });
        },
    },
    
}

</script>


<template>
    <div id="signin-div">
        <div class="padd"></div>
        <form @submit.prevent="signin()" class="signin">

            <label for="email">Email: <br><input type="text" v-model="form.email" required></label>
            <label for="password">Password: <br><input type="password" v-model="form.password" required></label>
            <div class="buttons">
                    <button type="submit" class="prominent">Continue</button>
                    <button type="button" class="secondary">Create Account</button>
            </div>
            <button @click="loginWithGoogle()" class="g-signin">Login with Google ? </button>
        </form>        
    </div>
</template>

<style scoped>

#signin-div {
    display: grid;
    grid-template-columns: 1fr 2fr ;
    grid-template-rows: 1fr;

    width: 100vw;
    height: 100vh;
}

.padd {
    background-color: #fc3171bf;
}

.signin {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    min-width: 29em;
    margin: auto;
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
    margin-top: 1em;
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

.g-signin {
    background: none;
    border: none;
    color: rgb(203, 153, 162);
}

</style>