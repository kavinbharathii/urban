
<script>

import { GoogleAuthProvider , signInWithPopup , onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase.js'
import Router from '@/router'

export default {
    data() {
        return {

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
        }
    },
    
}

</script>


<template>
    <div id="dev">
        <h1>Hello there!</h1>

        <label for="username">Username: <input type="text"></label>
        <label for="email">Email: <input type="text"></label>
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