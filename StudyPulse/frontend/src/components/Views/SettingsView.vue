<template>
  <div class="bg-white w-full flex flex-col">
    <h2 class="font-bold text-xl text-gray-400 pl-4 mt-4">Ayarlar</h2>
    <div class="lg:grid lg:grid-cols-2 gap-4 mt-4 p-4 flex flex-col">
      <div class="flex flex-col border rounded-lg border-gray-300 p-4 w-full gap-2">
        <h2 class="font-bold">Derslerim</h2>
        <div class="flex gap-2 mt-2 items-center">
          <input v-model="newSubject" placeholder="Yeni ders ekle" class="border p-1 rounded" />
          <button @click="addSubject" class="bg-[#8D1CCE] text-white rounded p-1">Ekle</button>
        </div>
        <ul class="flex gap-2 mt-2 flex-wrap">
          <li v-for="(s, idx) in settings?.subjects || []" :key="s" class="flex items-center gap-2 border-gray-300 text-slate-900 shadow-gray-300 shadow-md rounded p-1 h-fit text-nowrap text-sm">
            <div class="flex items-center gap-2">
              <span>{{ s }}</span>
              <small class="text-gray-500">- {{ (subjectStats[s] || 0) }} dk</small>
            </div>
            <button @click="removeSubject(idx)" class="text-red-500 ml-2">Kaldır</button>
          </li>
        </ul>
        <div class="mt-2">
          <button @click="saveSettings" class="mt-auto text-sm p-1 rounded w-fit flex gap-1 items-center shadow-md bg-green-600 text-white">Ayarları Kaydet</button>
        </div>
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
        <div class="mt-2 flex flex-col gap-4">
          <div class="flex gap-2 items-center">
            <div class="font-bold text-gray-500 w-40">Soru Sayısı (günlük):</div>
            <input type="number" v-model.number="settings.studyPreferences.dailyQuestionTarget" class="border p-1 rounded w-28" />
          </div>
          <div class="flex gap-2 items-center">
            <div class="font-bold text-gray-500 w-40">Çalışma Süresi (dakika/gün):</div>
            <input type="number" v-model.number="settings.studyPreferences.dailyStudyTargetMinutes" class="border p-1 rounded w-28" />
          </div>
          <div>
            <button @click="saveSettings" class="bg-green-600 text-white rounded p-1">Hedefleri Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { settingsAPI, sessionAPI } from '@/services/api'

export default {
  data() {
    return {
      settings: {
        subjects: [],
        studyPreferences: {
          dailyStudyTargetMinutes: 120,
          dailyQuestionTarget: 50,
        }
      },
      newSubject: '',
      subjectStats: {}, // { subjectName: totalMinutes }
    }
  },
  methods: {
    async loadSettings() {
      try {
        const raw = await settingsAPI.getSettings()
        this.settings = raw?.data || raw
        if (!this.settings.subjects) this.settings.subjects = []
        // load per-subject stats
        await this.loadSubjectStats()
      } catch (err) {
        console.error('Ayarlar yüklenemedi', err)
      }
    },
    async loadSubjectStats() {
      try {
        const raw = await sessionAPI.getStats()
        const data = raw?.subjectDistribution || raw?.data?.subjectDistribution || raw
        // data expected as array [{ _id: subjectName, totalMinutes }]
        const map = {}
        if (Array.isArray(data)) {
          data.forEach((row) => {
            const name = row._id || 'Unknown'
            map[name] = row.totalMinutes || 0
          })
        }
        this.subjectStats = map
      } catch (err) {
        console.warn('Subject stats yüklenemedi', err)
        this.subjectStats = {}
      }
    },
    addSubject() {
      const s = (this.newSubject || '').trim()
      if (!s) return
      if (!this.settings.subjects.includes(s)) this.settings.subjects.push(s)
      this.newSubject = ''
    },
    removeSubject(idx) {
      this.settings.subjects.splice(idx, 1)
    },
    async saveSettings() {
      try {
        const payload = {
          subjects: this.settings.subjects,
          studyPreferences: {
            ...this.settings.studyPreferences,
            dailyStudyTargetMinutes: this.settings.studyPreferences?.dailyStudyTargetMinutes || 120,
            dailyQuestionTarget: this.settings.studyPreferences?.dailyQuestionTarget || 50,
          }
        }

        const res = await settingsAPI.updateSettings(payload)
        this.settings = res?.data || res
        // reload stats and settings from server to ensure persistence
        await this.loadSettings()
        alert('Ayarlar kaydedildi')
      } catch (err) {
        console.error('Ayarlar kaydedilemedi', err)
        alert('Ayarlar kaydedilemedi')
      }
    }
  },
  mounted() {
    this.loadSettings()
  }
}
</script>
