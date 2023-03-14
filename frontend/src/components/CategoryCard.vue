<script>

export default {
    props: {
        categoryName: String,
        description: String
    },
    data() {
        return {

        }
    }
}

</script>

<!-- template -->
<template>
<div id="cardbody">
    <div class="text-area">
        <h1>{{ this.categoryName }}</h1>
        <p class="desc">{{ this.description }}</p>

        <button class="card-action-button">Learn more</button>

    </div>
    <div class="image-area">
        <!-- palceholder div -->
        <div id="image"></div>
    </div>

</div>
</template>

<!-- style -->
<style scoped>

#cardbody {
    color: #171717;
    background: #fefefe;
    border-radius: 10px;
    border: 3px solid #fc3171bf;

    width: 25vw;
    height: 30vh;
    margin: 0.8em;
    padding: 2em;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.desc {
    color: #464646;
}

.card-action-button {
    position: relative;
    /* top: 4em; */
}

#image {
    width: 100px;
    aspect-ratio: 1 / 1;
    background-color: #787878;
    border-radius: 10px;
}
</style>
