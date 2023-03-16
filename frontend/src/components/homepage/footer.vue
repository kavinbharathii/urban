<script>


export default {
    
}
</script>

<template>
    <div class="fot">
        <div class="icons-div">
            <div><font-awesome-icon icon="fa-brands fa-twitter icon" /></div>
            <div><font-awesome-icon icon="fa-brands fa-youtube icon"/></div>
            <div><font-awesome-icon icon="fa-brands fa-instagram icon" /></div>
            <div><font-awesome-icon icon="fa-solid fa-envelope" /></div>
        </div>
        <div class="made-div">
            <div>© 2023 ItArena Pte Ltd. All rights reserved.</div>
            <div>Made with <font-awesome-icon icon="fa-solid fa-heart hrt-icon" bounce /> in SG & PH</div>
        </div>
    </div>
</template>

<style scoped>

.fot{
    background-color: #fc3171bf;
    height: 10vh;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    padding: 0 5em;
}

.icons-div {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 2em;
    font-size: 20px;
    cursor: pointer;
}

.icon {
    font-size: 24px;
}

.made-div {
    width: 50%;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: end;
}

.made-div svg {
    padding: 0 0.5em;
    margin-top: 0.7em;
}

</style>