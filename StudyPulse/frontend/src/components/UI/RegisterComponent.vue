<template>
  <div class="max-w-md w-full">
    <h2 class="text-xl font-semibold mb-4">Kayıt Ol</h2>
  <form @submit.prevent="handleRegister" class="space-y-3">
      <div>
        <label class="text-sm text-gray-600">Ad</label>
        <input v-model="form.name" required class="border p-2 w-full rounded mt-1" />
      </div>
      <div>
        <label class="text-sm text-gray-600">Soyad</label>
        <input v-model="form.surname" required class="border p-2 w-full rounded mt-1" />
      </div>
      <div>
        <label class="text-sm text-gray-600">Email</label>
        <input v-model="form.email" type="email" required class="border p-2 w-full rounded mt-1" />
      </div>
      <div>
        <label class="text-sm text-gray-600">Şifre</label>
        <input
          v-model="form.password"
          type="password"
          required
          class="border p-2 w-full rounded mt-1"
        />
      </div>
      <div class="flex gap-2 items-center">
        <label class="text-sm text-gray-600">Rol</label>
        <select name="choose_role" id="role" v-model="form.role" class="text-sm text-gray-600">
          <option value="student">Öğrenci</option>
          <option value="parent">Veli</option>
        </select>
      </div>
      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
      <div v-if="success" class="text-green-500 text-sm">{{ success }}</div>
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="flex w-full justify-center rounded-md border border-transparent bg-[#8e1ccf] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#7a16b5] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {{ loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { authAPI } from '@/services/api'

export default {
  name: 'RegisterComponent',
  data() {
    return {
      form: {
        email: '',
        password: '',
        role: 'student',
        name: '',
        surname: '',
        school: '',
        class: '',
      },
      loading: false,
      error: '',
      success: '',
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      this.error = ''
      this.success = ''
      try {
        const res = await authAPI.register(this.form)
        // response contains token and data.user
        if (res.token) {
          localStorage.setItem('token', res.token)
        }
        this.success = 'Kayıt başarılı! Giriş yapabilirsiniz.'
        // Emit created user to parent so it can update immediately
        this.$emit('registered', res.data?.user || null)
      } catch (err) {
        console.error('Register error', err)
        this.error = err.response?.data?.message || err.message || 'Kayıt başarısız'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped></style>
