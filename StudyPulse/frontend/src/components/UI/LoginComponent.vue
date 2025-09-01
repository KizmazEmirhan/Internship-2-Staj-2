<template>
  <div class="max-w-md w-full">
    <h2 class="text-xl font-semibold mb-4">Giriş Yap</h2>
    <form @submit.prevent="login" class="space-y-3">
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
      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center gap-2"
          ><input type="checkbox" v-model="form.remember" /> Beni Hatırla</label
        >
        <button type="button" class="text-[#8e1ccf] hover:underline" @click="$emit('forgot')">
          Şifremi Unuttum
        </button>
      </div>

      <div class="flex justify-end">
        <button
          @click="handleLogin"
          type="submit"
          :disabled="loading"
          class="flex w-full justify-center rounded-md border border-transparent bg-[#8e1ccf] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#7a16b5] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { authAPI } from '@/services/api'

export default {
  name: 'LoginComponent',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
      error: '',
      remember: false,
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = ''
      try {
        const res = await authAPI.login(this.form)
        console.log('response->', res)
        localStorage.setItem('token', res.token)
        window.dispatchEvent(new Event('storage'))
        localStorage.setItem('user', JSON.stringify(res.data.user))
        this.$emit('login-success', { user: res.data.user, token: res.token })

        this.$router.push('/')
      } catch (err) {
        console.error('Login error', err)
        this.error = err.res?.data?.data?.message || err.message || 'Giriş başarısız'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
/* small nicety */
</style>
