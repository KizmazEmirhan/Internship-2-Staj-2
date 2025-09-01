<template>
  <div class="w-full">
    <div class="w-full">
      <div class="bg-white shadow-sm p-4">
        <h1 class="text-2xl font-semibold mb-4">Hesabım</h1>

        <div class="flex flex-col sm:flex-row gap-6">
          <!-- Profile Card -->
          <div
            class="col-span-1 bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between gap-4 w-full"
          >
            <div>
              <div class="flex flex-col items-center">
                <div
                  class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3"
                >
                  <i class="fa-solid fa-user text-2xl text-gray-400"></i>
                </div>
                <div class="font-bold text-lg">{{ fullName }}</div>
                <div class="text-sm text-gray-500 capitalize">{{ account.role }}</div>
              </div>

              <div class="mt-4">
                <ul class="text-sm text-gray-600 space-y-2">
                  <li><strong>Email:</strong> {{ account.email }}</li>
                  <li v-if="account.createdAt">
                    <strong>Kayıt Tarihi:</strong> {{ formatDate(account.createdAt) }}
                  </li>
                </ul>
              </div>
            </div>
            <button
              class="bg-[#8e1ccf] p-2 rounded text-white bottom-0 hover:bg-[#d10f97] cursor-pointer transition-all"
              @click="logout"
            >
              Çıkış Yap
            </button>
          </div>

          <!-- Account Form -->
          <div class="col-span-2 bg-white border border-gray-300 rounded-lg p-6 w-full">
            <h2 class="text-lg font-medium mb-3">Hesap Bilgileri</h2>
            <form @submit.prevent="saveAccount">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Ad</label>
                  <input
                    v-model="editProfile.name"
                    class="border border-gray-300 p-2 w-full rounded mt-1"
                  />
                </div>
                <div>
                  <label class="text-sm text-gray-600">Soyad</label>
                  <input
                    v-model="editProfile.surname"
                    class="border border-gray-300 p-2 w-full rounded mt-1"
                  />
                </div>
                <div>
                  <label class="text-sm text-gray-600">Email</label>
                  <input
                    v-model="editProfile.email"
                    type="email"
                    class="border border-gray-300 p-2 w-full rounded mt-1"
                  />
                </div>
                <div v-if="account.role === 'student'">
                  <label class="text-sm text-gray-600">Okul</label>
                  <input
                    v-model="editProfile.school"
                    class="border border-gray-300 p-2 w-full rounded mt-1"
                  />
                </div>
                <div v-if="account.role === 'student'">
                  <label class="text-sm text-gray-600">Sınıf</label>
                  <input
                    v-model="editProfile.class"
                    class="border border-gray-300 p-2 w-full rounded mt-1"
                  />
                </div>
              </div>

              <div class="flex justify-end gap-2 mt-4">
                <button type="button" @click="resetForm" class="px-4 py-2 bg-gray-200 rounded">
                  İptal
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-[#8e1ccf] text-white rounded"
                  :disabled="isSaving"
                >
                  {{ isSaving ? 'Kaydediliyor...' : 'Kaydet' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logout } from '@/services/auth'
import { getUser, updateUser } from '@/services/userAPI' // userAPI servisini ekleyin
import { authAPI } from '@/services/api' // API servisini import edin

export default {
  name: 'MyAccountView',
  data() {
    return {
      account: {
        name: '',
        surname: '',
        email: '',
        role: '',
        profile: {
          school: '',
          class: '',
        },
        createdAt: '',
      },
      editProfile: {
        name: '',
        surname: '',
        email: '',
        school: '',
        class: '',
      },
      isSaving: false,
    }
  },
  computed: {
    fullName() {
      return `${this.account.name} ${this.account.surname}`.trim()
    },
  },
  methods: {
    async fillBlanks() {
      try {
        const user = await getUser()
        this.account = user
        this.editProfile = {
          name: user.name || '',
          surname: user.surname || '',
          email: user.email || '',
          school: user.profile?.school || '',
          class: user.profile?.class || '',
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri yüklenirken hata:', error)
      }
    },

    async saveAccount() {
      this.isSaving = true
      try {
        // API'ye güncelleme isteği gönder
        const response = await authAPI.updateProfile(this.editProfile)

        // Başarılı olursa local state'i güncelle
        this.account = {
          ...this.account,
          ...this.editProfile,
          profile: {
            ...this.account.profile,
            school: this.editProfile.school,
            class: this.editProfile.class,
          },
        }

        alert('Hesap bilgileri başarıyla güncellendi')
      } catch (error) {
        console.error('Güncelleme hatası:', error)
        alert('Güncelleme başarısız: ' + (error.response?.data?.message || 'Bilinmeyen hata'))
      } finally {
        this.isSaving = false
      }
    },

    resetForm() {
      this.editProfile = {
        name: this.account.name || '',
        surname: this.account.surname || '',
        email: this.account.email || '',
        school: this.account.profile?.school || '',
        class: this.account.profile?.class || '',
      }
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR')
    },

    async logout() {
      try {
        await logout() // API logout çağrısı
      } catch (error) {
        console.error('Logout hatası:', error)
      } finally {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.$router.push('/login')
      }
    },
  },
  mounted() {
    this.fillBlanks()
  },
}
</script>
