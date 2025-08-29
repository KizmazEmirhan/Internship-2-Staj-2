<template>
  <div class="bg-white w-full flex flex-col">
    <h2 class="font-bold text-xl text-gray-400 pl-4 mt-4">Ayarlar</h2>
    <div class="lg:grid lg:grid-cols-2 gap-4 mt-4 p-4 flex flex-col">
      <div class="flex flex-col border rounded-lg border-gray-300 p-4 w-full gap-2">
        <h2 class="font-bold">Derslerim</h2>
        <ul class="flex gap-2 mt-1 flex-wrap lg:flex-nowrap">
          <li
            class="border-gray-300 text-slate-900 shadow-gray-300 shadow-md rounded p-1 h-fit text-nowrap text-sm"
          >
            Matematik
          </li>
          <li
            class="border-gray-300 text-slate-900 shadow-gray-300 shadow-md rounded p-1 h-fit text-nowrap text-sm"
          >
            Türkçe
          </li>
          <li
            class="border-gray-300 text-slate-900 shadow-gray-300 shadow-md rounded p-1 h-fit text-nowrap text-sm"
          >
            Fen Bilgisi
          </li>
          <li
            class="border-gray-300 text-slate-900 shadow-gray-300 shadow-md rounded p-1 h-fit text-nowrap text-sm"
          >
            Sosyal Bilgiler
          </li>
          <li
            class="border-gray-300 text-slate-900 shadow-gray-300 shadow-md rounded p-1 h-fit text-nowrap text-sm"
          >
            Din Kültürü
          </li>
          <li
            class="border-gray-300 text-slate-900 shadow-gray-300 shadow-md rounded p-1 h-fit text-nowrap text-sm"
          >
            İngilizce
          </li>
        </ul>
        <button
          class="mt-auto text-sm p-1 rounded w-fit flex gap-1 items-center shadow-md bg-[#8D1CCE] text-white cursor-pointer hover:bg-[#d10f97]"
        >
          Ders Ekle<i class="fa-regular fa-square-plus"></i>
        </button>
      </div>
      <div class="flex flex-col border rounded-lg border-gray-300 p-4 w-full gap-2">
        <h2 class="font-bold">Çalışma Süresi / Etüt Süresi</h2>
        <div class="text-sm text-gray-500">
          Çalışmaya başla dendiğinde zamanlayıcının başlayacağı süre
        </div>
        <div class="text-sm">Her çalışma etütü süresi : <b>40:00</b></div>
        <button
          class="cursor-pointer hover:bg-[#d10f97] bg-[#8D1CCE] text-white w-fit rounded p-1 text-sm"
        >
          Süreyi Değiştir
        </button>
      </div>
      <div class="flex flex-col border rounded-lg border-gray-300 p-4 w-full gap-2">
        <h2 class="font-bold">Uygulanan Tema</h2>
        <div class="mt-auto">
          <div class="flex items-center gap-2 text-sm"><input type="checkbox" /> Açık Tema</div>
          <div class="flex items-center gap-2 text-sm"><input type="checkbox" /> Koyu Tema</div>
        </div>
      </div>
      <div class="flex flex-col border rounded-lg gap-2 border-gray-300 p-4 w-full">
        <h2 class="font-bold">Günlük Hedef</h2>
        <div class="mt-auto flex flex-col gap-4">
          <div class="flex gap-2 text-sm sm:flex-row flex-col">
            <div class="flex w-full gap-2">
              <div class="font-bold text-gray-500">Soru Sayısı :</div>
              <div>ayarlar.defaultSoruSayısı</div>
            </div>
            <button
              class="cursor-pointer hover:bg-[#d10f97] bg-[#8D1CCE] text-white h-fit rounded p-1 text-sm sm:ml-auto text-nowrap"
            >
              Hedef Soru Sayısını Değiştir
            </button>
          </div>
          <div class="flex gap-2 text-sm flex-col sm:flex-row">
            <div class="flex w-full gap-2">
              <div class="font-bold text-gray-500">Çalışma Süresi :</div>
              <div>ayarlar.defaultCalismaSuresi</div>
            </div>
            <button
              class="cursor-pointer hover:bg-[#d10f97] bg-[#8D1CCE] text-white h-fit rounded p-1 text-sm sm:ml-auto text-nowrap"
            >
              Hedef Çalışma Süresini Değiştir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>
