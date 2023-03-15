<script>
export default {
    data() {
        return{

        }
    },

}
</script>

<template>
    <div id="dev">
        <div class="circle"></div>

        <div class="head-area">
            <h1>We are</h1> 
            <h1>IT Arena</h1>
        </div>

        <div class="text-area">
            We provide <span style="color: #fc3171bf;">high quality</span> services ranging from CCTV, Laptop and Desktop repairs to UPS, Plumbing and Electricals.
        </div>
    </div>
</template>

<style scoped>

#dev {
    width: 100vw;
    height: 100vh;

    position: relative;
    overflow: hidden;

    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.circle {
    width: 100vw;
    aspect-ratio: 1 / 1;
    border-radius: 50vw;
    
    background-color: #fc3171bf;

    position: absolute;
    top: -50vw;
    left: -50vw;
    z-index: -10;
}

#dev > .head-area > h1 {
    font-size: 5.5em;
}

#dev > .text-area {
    width: 20vw;
    font-size: 1.3em;

}

</style>
