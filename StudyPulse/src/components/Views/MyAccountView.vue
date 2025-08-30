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
                <div class="font-bold text-lg">{{ account.name }}</div>
                <div class="text-sm text-gray-500">{{ account.role }}</div>
              </div>

              <div class="mt-4">
                <ul class="text-sm text-gray-600 space-y-2">
                  <li><strong>Email:</strong> {{ account.email }}</li>
                  <li><strong>Kayıt Tarihi:</strong> {{ account.createdAt.split('T')[0] }}</li>
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
                  <label class="text-sm text-gray-600">Ad Soyad</label>
                  <input
                    v-model="account.name"
                    class="border border-gray-300 p-2 w-full rounded mt-1"
                  />
                </div>
                <div>
                  <label class="text-sm text-gray-600">Email</label>
                  <input
                    v-model="account.email"
                    class="border border-gray-300 p-2 w-full rounded mt-1"
                  />
                </div>
              </div>

              <div class="flex justify-end gap-2 mt-4">
                <button type="button" @click="resetForm" class="px-4 py-2 bg-gray-200 rounded">
                  İptal
                </button>
                <button type="submit" class="px-4 py-2 bg-[#8e1ccf] text-white rounded">
                  Kaydet
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
import { getUser } from '@/services/getUser'
export default {
  name: 'MyAccountView',
  data() {
    return {
      account: {
        name: 'User Name',
        email: 'user@example.com',
        phone: '',
        role: 'Student',
        createdAt: '',
      },
    }
  },
  methods: {
    fillBlanks() {
      getUser().then((user) => {
        this.account = user

        console.log(this.account)
      })
    },
    saveAccount() {
      // TODO: API call to save account
      alert('Hesap bilgileri kaydedildi (mock)')
    },
    resetForm() {
      this.account = { name: 'User Name', email: 'user@example.com', phone: '', role: 'Student' }
    },
    changePassword() {
      if (this.password.new !== this.password.confirm) {
        alert('Yeni şifreler eşleşmiyor')
        return
      }
      // TODO: API call to change password
      alert('Şifre değiştirildi (mock)')
      this.password = { current: '', new: '', confirm: '' }
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/auth')
    },
  },
  mounted() {
    this.fillBlanks()
  },
}
</script>
