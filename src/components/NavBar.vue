<template>
  <nav
    class="bg-white shadow flex items-center justify-between w-full fixed top-0 px-4 sm:px-6 lg:px-8 py-0"
  >
    <div class="hidden sm:flex flex-1 justify-start">
      <a href="/" class="flex-shrink-0">
        <img src="@/assets/1logoquizzmates.png" alt="Quizzmates Logo" class="h-15 sm:h-14 object-contain" />
      </a>
    </div>

    <div class="flex-shrink-0 flex gap-4 sm:gap-8 text-sm sm:text-base font-bold text-gray-700">
      <a href="/" class="hover:text-[#a64c8a]">Home</a>
      <a href="/credit" class="hover:text-[#a64c8a]">Credit</a>
      <a href="https://promedui.com/" class="hover:text-[#a64c8a]">More</a>
    </div>

    <div class="flex flex-1 justify-end">
      <div class="flex-shrink-0">
        <img src="@/assets/logohimproui.png" alt="Himproui Logo" class="h-15 sm:h-14 object-contain" />
      </div>
    </div>
  </nav>
</template>