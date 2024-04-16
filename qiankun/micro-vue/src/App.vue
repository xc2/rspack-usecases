<template>
  <div class="a">Micro Vue Mounted</div>
</template>
<style scoped lang="less">
.a {
  color: red;
  padding: calc(~'16px + env(safe-area-inset-bottom)');
}
</style>
<script>
export default {
  name: "A",
};
</script>
