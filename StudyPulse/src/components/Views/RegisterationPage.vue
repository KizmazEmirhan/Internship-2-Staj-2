<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="bg-white rounded-lg shadow-md w-full max-w-4xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="hidden md:flex items-center justify-center">
        <img src="../../assets/logoLight.png" alt="logo" class="w-48" />
      </div>

      <div>
        <div class="flex gap-4 mb-4">
          <button :class="tab === 'login' ? 'border-b-2 border-[#8e1ccf] pb-2' : ''" @click="tab='login'">Giriş Yap</button>
          <button :class="tab === 'register' ? 'border-b-2 border-[#8e1ccf] pb-2' : ''" @click="tab='register'">Kayıt Ol</button>
        </div>

        <div>
          <LoginComponent v-if="tab==='login'" @login-success="onLoginSuccess" />
          <RegisterComponent v-else @registered="onRegister" />
        </div>

        <div class="mt-4 text-sm text-gray-500">
          <p>Devam ederek hizmet şartlarını kabul etmiş olursunuz.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginComponent from '../UI/LoginComponent.vue'
import RegisterComponent from '../UI/RegisterComponent.vue'

export default {
  name: 'RegisterationPage',
  components: { LoginComponent, RegisterComponent },
  data() {
    return { tab: 'login' }
  },
  methods: {
    onLoginSuccess() {
      this.$router.push('/')
    },
    onRegister() {
      this.tab = 'login'
    },
  },
}
</script>

<style scoped></style>
