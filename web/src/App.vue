<script setup>
import { ref } from 'vue';
import Test_1 from "./views/videoView/index.vue";
</script>

<template>
    <Test_1>
    </Test_1>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em rgba(100, 108, 255, 0.667));
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
