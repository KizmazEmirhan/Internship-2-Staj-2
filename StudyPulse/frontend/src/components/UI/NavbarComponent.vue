<template>
  <div id="navbar-begin" class="bg-white border-r border-gray-100 hidden sm:block">
    <div id="list-wrapper" class="p-4">
      <ul id="list" class="flex sm:flex-col gap-2 text-nowrap">
        <li>
          <RouterLink
            to="/"
            class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around"
          >
            <i class="fa-solid fa-house"></i>
            Ana Sayfa
          </RouterLink>
        </li>

        <li>
          <RouterLink
            :key="$route.fullPath"
            to="/sessions"
            class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around"
          >
            <i class="fa-solid fa-clock"></i>
            Oturumlar
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/settings"
            class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around"
          >
            <i class="fa-solid fa-gears"></i>
            Ayarlar
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/"
            class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around"
          >
            <i class="fa-solid fa-book"></i>
            Dersler
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/"
            class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around"
          >
            <i class="fa-solid fa-list-check"></i>
            Görevler
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/"
            class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around"
          >
            <i class="fa-solid fa-award"></i>
            Sınavlar
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
</script>
