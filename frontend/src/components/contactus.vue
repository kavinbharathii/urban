<script>
export default {
    data() {
        return{

        }
    },
}
</script>

<template>
    <div class="main">
        <div class="left">
            <div class="logo"></div>
            <div class="loc">
                <div>hello@servbees.com</div>
                <div>PH: 360Verve, OPC41F, Pioneer Highlands West Tower 2, Madison St., Mandaluyong City</div>
                <div>SG: Servbees Pte. Ltd 9 Temasek Boulevard, #07-01 Suntec Tower 2. Singapore 038989
            </div>
        </div>
        </div>

        <div class="right">
            <div class="tle">Contact Us</div>
            <div class="des">Interested in being a partner? Thinking of offering your products or services on Servbees? Have some questions? Get in touch with us so we can get buzzy together!</div>
            <div class="name-email">
                <div class="name"><input type="text"><span>Full Name</span></div>
                <div class="email"><input type="email"><span>Email Address</span></div>
            </div>
            <div class="text-area-div">
                <textarea name="message" placeholder="Your Message"></textarea>
            </div>
            <div class="btn"><button>Submit</button></div>
        </div>
    </div>
</template>

<style scoped>

*{
    font-family: M PLUS Rounded\ 1c,sans-serif;

}

.main {
    width: 100vw;
    height: 100vh;
    display: flex;
}

.left {
    width: 30%;
    padding: 10em 0em 0 4em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.right {
    width: 70%;
    display: flex;
    flex-direction: column;
    padding: 10em 5em 10em 2em;
}

.name , .email {
    position: relative;
    width: 40%;
}

.name {
    margin: 0 5% 0 0;
}

span{
    position: absolute;
    top: 15px;
    left: 20px;
    color: grey;
}

.right .tle {
    font-size: 24px;
    margin-bottom: 1em;
}

.right .des {
    color: gray;
    margin-bottom: 2em;
}

.right .name-email {
    display: flex;
    margin-bottom: 1.5em;
}

input{
    outline: none;
    padding: 24px 9px 16px 18px;
    width: 100%;
    color: rgb(72, 72, 72);
    border: 1px solid rgb(157, 157, 157);
    border-radius: 8px;
    font-size: 18px;
}

input:focus ~ span {
    transform: translateX(0px) translateY(-7px);
    transition: .3s;
    font-size: 14px;
    color: grey;
}

textarea {
    border: 1px solid rgb(157, 157, 157);
    outline: none;
    padding: 16px;
    width: 85%;
    border-radius: 8px;
    color: rgb(72, 72, 72);
    margin-bottom: 1.5em;
    font-size: 18px;
}

.btn {
    display: flex;
    align-items: center;
    margin-right: 13%;
    justify-content: end;
}

.btn button {
    outline: none;
    border: none;
    background: none;
    padding: 10px 41px;
    background-color: gray;
    cursor: pointer;
}

.logo {
    width: 40%;
}
.loc {
    width: 60%;
    display: flex;
    flex-direction: column;
    gap: .75em;
    font-size: 14px;
}

</style>