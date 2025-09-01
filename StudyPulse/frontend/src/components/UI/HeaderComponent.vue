<template>
  <div class="flex items-center justify-center">
    <div class="container bg-white  rounded-tl-xl rounded-tr-xl">
      <div id="header-start" class="flex justify-between items-center p-4">
        <div id="logo">
          <img src="../../assets/logoLight.png" alt="" class="w-40" />
        </div>
        <div id="profile-section" class="flex gap-4 items-center">
          <div class="flex flex-col gap-1">
            <div>{{ userData?.name + userData?.surname || 'Giriş yapılmadı' }}</div>
            <div class="text-gray-400 text-sm">{{ userData?.role || 'Student' }}</div>
          </div>
          <div id="icon-wrapper" class="flex justify-center items-center cursor-pointer" @click="goToAccountPage">
            <div id="circle" class="p-2 rounded-full bg-[#F3f3f3] w-[44px] h-[44px]"></div>
            <i class="fa-solid fa-user text-xl absolute"></i>
          </div>
            <div id="hover-menu" class="hidden group-hover:block bg-white absolute">
            <ul>
              <li>Hesabım</li>
              <li>Çıkış Yap</li>
            </ul>
          </div>
        </div>
      </div>
      <div id="navbar-mobile " class="block sm:hidden p-4">
        <ul id="list" class="flex sm:flex-col gap-2 text-nowrap overflow-auto">
          <li>
            <RouterLink to="/"
              class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around">
              <i class="fa-solid fa-house"></i>
              Ana Sayfa
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/sessions"
              class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around">
              <i class="fa-solid fa-clock"></i>
              Oturumlar
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/settings"
              class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around">
              <i class="fa-solid fa-gears"></i>
              Ayarlar
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/"
              class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around">
              <i class="fa-solid fa-book"></i>
              Dersler
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/"
              class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around">
              <i class="fa-solid fa-list-check"></i>
              Görevler
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/"
              class="p-2 bg-[#8e1ccf] rounded-lg shadow-sm shadow-gray-500 text-white w-full hover:shadow-2xl hover:translate-x-2 transition-all hover:bg-[#d10f97] flex gap-2 items-center justify-around">
              <i class="fa-solid fa-award"></i>
              Sınavlar
            </RouterLink>
          </li>
        </ul>
      </div>
      <hr class="w-full p-0 text-gray-100">
      </hr>
    </div>
  </div>
</template>


<script>
export default {
  props:{userData:{type:Object,required:false}},


  methods: {
    goToAccountPage() {
      this.$router.push('/account')
    },
   
  },


}
</script>