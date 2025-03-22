<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 w-screen h-svh">
    <!-- Grid Cell 1-->
    <div class="overflow-hidden flex items-center justify-center">
      <video
        class="object-cover w-full h-full"
        autoplay
        muted
        loop
      >
        <source
          src="@/assets/images/trailer_temp.webm"
          type="video/webm"
        />
      </video>
    </div>

    <!-- Grid Cell 2-->
    <div class="h-svh col-span-2">
      <router-view />
    </div>
  </div>
</template>
