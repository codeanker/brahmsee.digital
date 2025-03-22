<script setup lang="ts"></script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 w-screen h-svh">
    <!-- Grid Cell 1-->
    <div class="bg-public bg-center bg-cover"></div>

    <!-- Grid Cell 2-->
    <div class="h-svh">
      <router-view />
    </div>
  </div>
</template>
