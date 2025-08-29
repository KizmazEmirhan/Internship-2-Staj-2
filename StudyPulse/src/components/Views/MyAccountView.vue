<template>
  <div class="w-full">
    <div class="w-full">
      <div class="bg-white shadow-sm p-4">
        <h1 class="text-2xl font-semibold mb-4">Hesabım</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Profile Card -->
          <div class="col-span-1 bg-white border border-gray-300 rounded-lg p-4">
            <div class="flex flex-col items-center">
              <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <i class="fa-solid fa-user text-2xl text-gray-400"></i>
              </div>
              <div class="font-bold text-lg">User Name</div>
              <div class="text-sm text-gray-500">Student</div>
            </div>

            <div class="mt-4">
              <ul class="text-sm text-gray-600 space-y-2">
                <li><strong>Email:</strong> user@example.com</li>
                <li><strong>Kayıt Tarihi:</strong> 01/01/2025</li>
                <li><strong>Plan:</strong> Ücretsiz</li>
              </ul>
            </div>
          </div>

          <!-- Account Form -->
          <div class="col-span-2 bg-white border border-gray-300 rounded-lg p-6">
            <h2 class="text-lg font-medium mb-3">Hesap Bilgileri</h2>
            <form @submit.prevent="saveAccount">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Ad Soyad</label>
                  <input v-model="account.name" class="border border-gray-300 p-2 w-full rounded mt-1" />
                </div>
                <div>
                  <label class="text-sm text-gray-600">Email</label>
                  <input v-model="account.email" class="border border-gray-300 p-2 w-full rounded mt-1" />
                </div>
                <div>
                  <label class="text-sm text-gray-600">Telefon</label>
                  <input v-model="account.phone" class="border border-gray-300 p-2 w-full rounded mt-1" />
                </div>
                <div>
                  <label class="text-sm text-gray-600">Rol</label>
                  <input v-model="account.role" class="border border-gray-300 p-2 w-full rounded mt-1" />
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

            <hr class="my-4 text-gray-200" />

            <h3 class="text-md font-medium mb-2">Şifre Değiştir</h3>
            <form @submit.prevent="changePassword">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Mevcut Şifre</label>
                  <input
                    v-model="password.current"
                    type="password"
                    class="border border-gray-300 p-2 w-full rounded mt-1"
                  />
                </div>
                <div>
                  <label class="text-sm text-gray-600">Yeni Şifre</label>
                  <input
                    v-model="password.new"
                    type="password"
                    class="border border-gray-300 p-2 w-full rounded mt-1"
                  />
                </div>
                <div>
                  <label class="text-sm text-gray-600">Yeni Şifre (Tekrar)</label>
                  <input
                    v-model="password.confirm"
                    type="password"
                    class="border border-gray-300 p-2 w-full rounded mt-1"
                  />
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-4">
                <button type="submit" class="px-4 py-2 bg-[#8e1ccf] text-white rounded">
                  Şifreyi Değiştir
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
export default {
  name: 'MyAccountView',
  data() {
    return {
      account: {
        name: 'User Name',
        email: 'user@example.com',
        phone: '',
        role: 'Student',
      },
      password: {
        current: '',
        new: '',
        confirm: '',
      },
    }
  },
  methods: {
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
  },
}
</script>
