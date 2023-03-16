
<script>

export default {
    data() {
        return {

        }
    }
}
</script>


<template>
    <div id="dev">
        <h1>Hello there!</h1>

        <label for="username">Username: <input type="text"></label>
        <label for="email">Email: <input type="text"></label>
        
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