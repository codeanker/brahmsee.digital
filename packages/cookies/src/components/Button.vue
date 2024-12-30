<script setup lang="ts">
const promise = new Promise((resolve, reject) => resolve('value'));
promise;

async function returnsPromise() {
  return 'value';
}
returnsPromise().then(() => {});

Promise.reject('value').catch();

Promise.reject('value').finally();

[1, 2, 3].map(async x => x + 1);

const test = 'test'

</script>
<template>
  <button
    type="button"
    class="flex space-x-2 w-full justify-center rounded-lg focus:outline-none focus:ring-0 active:outline-none active:ring-0 transition-all"
  >
    <slot></slot>
  </button>
</template>
