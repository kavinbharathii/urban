
<script>

import { auth } from '@/views/firebase.js'

export default {
    props: {
        showOptions: Boolean,
        userName: String,
        loginedEmail : String
    },
    data() {
        return {
            userSignedIn: false,
            login:'',
            userDetail : false
        }
    },
    methods: {
        logout() {
            console.log('logout')
            auth.signOut();
        }
    }
}

</script>

<template>

<div class="navbar">
    <div class="logo">
        <div>Serve<span style="color: var(--rose-dark);">To</span>All</div>
    </div>

    <div class="links">
        <router-link to="/cart"><div class="action-button cart-btn"><span class="material-symbols-outlined">shopping_cart</span></div></router-link>
        <router-link to="/signin" v-if="this.showOptions">
            <div class="action-button signin">Sign In</div>
        </router-link>
        <router-link to="/signup" v-if="this.showOptions">
            <div class="action-button signup">Sign Up</div>
        </router-link>

        <div class="profile-div-large" v-if="!this.showOptions">
            <div class="email"><span class="material-symbols-outlined">mail</span> {{ this.loginedEmail }}</div>
            <div @click="logout()" class="action-button signout">Sign Out</div>
        </div>

        <div class="profile-icon" v-if="this.userName !== ''" @click="this.userDetail = !this.userDetail">
            <span class="material-symbols-outlined">account_circle</span>
        </div>

        <div class="profile-div-small" v-if="this.userDetail">
            <div class="email"> <span class="material-symbols-outlined">mail</span> {{ this.loginedEmail }}</div>
            <div @click="logout()" class="action-button signout">Sign Out</div>
        </div>
    </div>

</div>

</template>

<style scoped>

.navbar {
    width: 100vw;
    height: 10vh;
    
    background-color: #fefefe;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    position: fixed;
}


.logo {
    font-size: 2em;
    margin-left: 2em
}

.links {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
    gap: 1em;
    margin-right: 2em;
}

.action-button {
    padding: 3px 0.8em;
    border: 1px solid #171717;
    border-radius: 5px;
}

.signin {
    color: #171717;
}

.signup , .signout {
    color: #fefefe;
    background-color: #171717;
}

.cart-btn {
    color: #fefefe;
    background-color: #fc3171bf;
    border: none;
    margin-right: 2em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.25em 1em;
}

.cart-btn span  {
    font-size: 20px;
}

.name {
    cursor: pointer;
}

.name span {
    color: #fc3171bf;
    font-size: 28px;
    margin: 0.15em .3em 0 .5em;
}

.profile-div-large {
    display: flex;
    gap: 2em;
    align-items: center;
    justify-content: center;
}

.profile-div-large .email {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3em;
}

.profile-div-small , .profile-icon{
    display: none;
}

@media only screen and (max-width: 768px) {
    .logo {
        margin-left: .5em;
    }
    .cart-btn{
        margin-right: 0;
    }
    .links {
        margin: 0 0.75em 0 0;
        gap: 1.2em;
    }

    .profile-div-large {
        display: none;
    }

    .profile-icon {
        display: flex;
        color: #fc3171bf;
    }

    .profile-div-small
    {
        position: absolute;
        top: 60px;
        right: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.4em;
        padding: 0 0 2em 1em;
        background: white;
    }

    .profile-div-small .email {
        display: flex;
        gap: .75em;
    }
}

</style>