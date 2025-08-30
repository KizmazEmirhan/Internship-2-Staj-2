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
				<input v-model="form.password" type="password" required class="border p-2 w-full rounded mt-1" />
			</div>
			<div class="flex items-center justify-between text-sm">
				<label class="flex items-center gap-2"><input type="checkbox" v-model="form.remember" /> Beni Hatırla</label>
				<button type="button" class="text-[#8e1ccf] hover:underline" @click="$emit('forgot')">Şifremi Unuttum</button>
			</div>
			<div class="flex justify-end">
				<button type="submit" class="px-4 py-2 bg-[#8e1ccf] text-white rounded">Giriş Yap</button>
			</div>
		</form>
	</div>
</template>

<script>
import { login } from '../../services/auth'

export default {
	name: 'LoginComponent',
	data() {
		return {
			form: {
				email: '',
				password: '',
				remember: false,
			},
			loading: false,
			error: null,
		}
	},
	methods: {
		async login() {
			try {
				this.loading = true
				const res = await login(this.form.email, this.form.password)
				this.$emit('login-success', res)
			} catch (err) {
				console.error('Login error', err)
				this.error = err.response?.data?.message || err.message || 'Giriş başarısız'
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
