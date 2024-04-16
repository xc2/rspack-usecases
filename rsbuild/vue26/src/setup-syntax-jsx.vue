<script setup lang="jsx">
import { ref } from "vue";
let count = ref(100);
const increment = () => {
  count.value++;
};
const Render = () => (
  <div>
    <button onClick={increment}> click!!! </button>
  </div>
);
</script>

<template>
  <div>
    <p class="setup-jsx">{{ count }}</p>
    <Render />
  </div>
</template>
