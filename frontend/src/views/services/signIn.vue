
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
                    console.log(user)
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
    <div id="dev">
        <form @submit.prevent="signin()">
            <label for="username">Username: <input type="text" v-model="form.name" required></label>
            <label for="email">Email: <input type="text" v-model="form.email" required></label>
            <label for="password">Password: <input type="password" v-model="form.password" required></label>
            <button type="submit">Submit</button>
        </form>        
        <button @click="loginWithGoogle()">Login with Google</button>
    </div>
</template>

<style scoped>

#dev {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    width: 100vw;
    height: 100vh;
}

</style>